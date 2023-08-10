import IDocument from '../interface/Document';
import IUser from '../interface/IUser';
import { model, Schema } from 'mongoose';
import config from '../../config';
import { SocialVendor } from '../socialVendor';
import { AgeGroup } from './ageGroup';
import { Gender } from './gender';

type UserDocument = IUser & IDocument;

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String
    },
    socialId: {
      type: String,
      unique: false
    },
    socialVendor: {
      type: String,
      enum: SocialVendor,
      unique: false
    },
    hashedPassword: {
      type: String,
      required: false
    },
    nickname: {
      type: String,
      required: true,
      unique: true
    },
    ageGroup: {
      type: String,
      enum: AgeGroup,
      default: AgeGroup.UNDEFINED,
      required: false
    },
    gender: {
      type: String,
      enum: Gender,
      default: Gender.ETC
    },
    profileImageUrl: {
      type: String,
      required: false,
      default: config.defaultProfileImgUrl
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

userSchema.index({ socialVendor: 1, email: 1 }, { unique: true });

const User = model<UserDocument>('User', userSchema);

export default User;

export { UserDocument };
