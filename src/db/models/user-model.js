import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
  // email로 유저 찾기 기능
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }
  // Id로 유저 찾기 기능
  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  } 
  // 유저 생성 기능
  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }
  // 유저 목록 불러오기 기능
  async findAll() {
    const users = await User.find({});
    return users;
  }
  // 유저 업데이트 기능
  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }
  // 유저 삭제 기능 구현
  async delete(userId) {
      await User.findOneAndDelete({ _id: userId });
  }
}


const userModel = new UserModel();

export { userModel };
