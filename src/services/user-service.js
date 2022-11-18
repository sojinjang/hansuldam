import { userModel } from "../db";
import { BadRequest, Unauthorized, NotFound } from "../utils/errorCodes";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }
  // Oauth 로그인 서비스
  async OauthLogin(userInfo) {
    const { fullName, email, phoneNumber, password } = userInfo;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = {
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
    };

    let user = await this.userModel.findByEmail(email);
    if (!user) {
      user = await this.userModel.create(newUserInfo);
    }

    const secretKey = process.env.JWT_SECRET_KEY;

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    return { token };
  }

  // 회원가입
  async addUser(userInfo) {
    // 객체 destructuring
    const { fullName, email, password, phoneNumber, address } = userInfo;

    // 우선 비밀번호 해쉬화(암호화)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = {
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    };

    try {
      // db에 저장
      const createdNewUser = await this.userModel.create(newUserInfo);
      return createdNewUser;
    } catch {
      throw new BadRequest("This Email is Currently in Use.", 4101);
    }
  }

  // 로그인
  async getUserToken(loginInfo) {
    // 객체 destructuring
    const { email, password } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new NotFound("This Email Not in DB", 4102);
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Unauthorized("Incorrect Password", 4103);
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY;

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    return { token };
  }

  // 사용자 목록을 받음(관리자)
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  // 사용자 개인정보를 받음.
  async getUserOne(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  // 이메일로 사용자 개인정보를 받음(이메일 체크)
  async emailCheck(email) {
    const user = await this.userModel.findByEmail(email);

    const isDuplicatedEmail = user ? true : false;
    const answer = { isDuplicatedEmail };

    return answer;
  }

  // 사용자 삭제.
  async deleteUserOne(userId) {
    const user = await this.userModel.deleteById(userId);
    return user;
  }

  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    // 객체 destructuring
    const { userId, currentPassword } = userInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new NotFound("UserId does not in DB", 4104);
    }

    // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Unauthorized("Incorrect Password", 4103);
    }

    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    const { password } = toUpdate;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    // 업데이트 진행
    user = await this.userModel.update({ _id: userId }, toUpdate);

    return user;
  }

  async NoPasswordSetUser(userId, toUpdate) {
    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new NotFound("UserId does not in DB", 4104);
    }
    // 업데이트 진행
    user = await this.userModel.update({ _id: userId }, toUpdate);

    return user;
  }

  // 장바구니 update
  async addCart(userInfo) {
    // 객체 destructuring
    const { userId, productsInCart } = userInfo;
    // 이메일 중복 확인
    const updateCart = await this.userModel.update(
      { _id: userId },
      { productsInCart }
    );

    return updateCart;
  }

  // 장바구니 get
  async getCart(userId) {
    // 객체 destructuring
    // 이메일 중복 확인
    const { productsInCart } = await this.userModel.findById(userId);

    return productsInCart;
  }

  //비밀번호 찾기 api
  async findUserByEmail(email) {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new NotFound("Email Not In DB", 4102);
    }
    return user;
  }

  async changePasswordAsRandom(userId, newHashedPassword) {
    const toUpdate = { password: newHashedPassword };
    // 우선 해당 id의 유저가 db에 있는지 확인
    const user = await this.userModel.update({ _id: userId }, toUpdate);

    return user;
  }
}

const userService = new UserService(userModel);

export { userService };
