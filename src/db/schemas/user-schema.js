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
    password: {
      type: String,
      // required: true,
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
        }
      ),
      required: false,
    },
    admin: { // true : admin , false : basic-user
      type: Boolean,
      required: true,
      default: false,
    },
    loginTypeCode: { // 0 : signup user , 1 :  kakao user
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

export { UserSchema };
