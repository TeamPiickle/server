import IDocument from './interface/Document';
import IUser from './interface/IUser';
import { model, Schema } from 'mongoose';

type UserDocument = IUser & IDocument;

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    profileImageUrl: {
      type: String,
      required: false
    },
    cardIdList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Card'
      }
    ]
  },
  {
    timestamps: true
  }
);

const User = model<UserDocument>('User', userSchema);

export default User;
