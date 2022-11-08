import { userModel } from "../db";
import {} from "./errorCodes";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(userModel) {
    this.userModel = userModel;
  }

  // 회원가입
  async addUser(userInfo) {
    // 객체 destructuring
    const { fullName, email, password, phoneNumber, address } = userInfo;

<<<<<<< HEAD
    // 이메일 중복 확인
    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw NeedChangeEmail;
    }
=======
    // 이메일 중복 확인 - email unique이므로 필요 X
    // const user = await this.userModel.findByEmail(email);
    // if (user) {
    //   throw new Error(
    //     "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
    //   );
    // }
>>>>>>> 7dc2048c8df332a1ebec4ba4e4de6e6b0e6a413c

    // 이메일 중복은 이제 아니므로, 회원가입을 진행함

    // 우선 비밀번호 해쉬화(암호화)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = {
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    };

    // db에 저장
    const createdNewUser = await this.userModel.create(newUserInfo);

    return createdNewUser;
  }

  // 로그인
  async getUserToken(loginInfo) {
    // 객체 destructuring
    const { email, password } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw EmailNoInDB;
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw PasswordError;
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY;

    // 2개 프로퍼티를 jwt 토큰에 담음
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    return { token };
  }

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }

  // 사용자 개인정보를 받음.
  async getUserOne(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  // 사용자 삭제.
  async deleteUserOne(userId) {
    const user = await this.userModel.delete(userId);
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
      throw NoInDB;
    }

    // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw PasswordError;
    }

    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    const { password } = toUpdate;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    // 업데이트 진행
    user = await this.userModel.update({
      userId,
      updateObj: toUpdate,
    });

    return user;
  }

  // 유저정보에 주문id 추가.
  async addOrderIdInUser(userId, orderId) {
    // 객체 destructuring

    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    const toUpdate = { $push: { orders: orderId } };
    // 업데이트 진행
    user = await this.userModel.update({
      userId,
      updateObj: toUpdate,
    });

    return user;
  }

  // 장바구니 update
  async addCart(userInfo) {
    const { userId, productsInCart } = userInfo;
    const updateCart = await this.userModel.update({
      userId,
      updateObj: { productsInCart },
    });

    return updateCart;
  }

  // 장바구니 get
  async getCart(userId) {
    const { productsInCart } = await this.userModel.findById(userId);

    return productsInCart;
  }
  //비밀번호 찾기 api
  async findUserByEmail(email) {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    return user;
  }

  async changePasswordAsRandom(userId, newHashedPassword) {
    const toUpdate = { password: newHashedPassword };
    // 우선 해당 id의 유저가 db에 있는지 확인
    const user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
  }
}

const userService = new UserService(userModel);

export { userService };
