import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: { // Oauth 유저는 비밀번호를 추후에 설정해야해서 required 주지 않았습니다.
      type: String,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: new Schema(
        {
          postalCode: String,
          address1: String,
          address2: String,
        },
        {
          _id: false,
        },
      ),
      required: false,
    },
    isAdmin: {
      // true : admin , false : basic-user
      type: Boolean,
      required: true,
      default: false,
    },
    loginTypeCode: {
      // 0 : signup user , 1 :  kakao user
      type: Number,
      required: true,
      default: 0,
    },
    profileImg: {
      // 랜덤 프로필사진 기능 추가
      type: String,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

export { UserSchema };
