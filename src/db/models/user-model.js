import { model } from "mongoose";
import { UserSchema } from "../schemas/user-schema";

const User = model("users", UserSchema);

export class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  async findAll() {
    const users = await User.find({});
    return users;
  }

  // updateObj 에는 객체가 들어가야함
  async update({ userId, updateObj }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, updateObj, option);
    return updatedUser;
  }

  async delete(userId) {
    const filter = { _id: userId };
    const deletedUser = await User.deleteOne(filter);
    return deletedUser;
  }
}

const userModel = new UserModel();

export { userModel };
