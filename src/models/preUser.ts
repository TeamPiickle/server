import { model, Schema } from 'mongoose';

const preUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    emailVerified: {
      type: Schema.Types.Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const PreUser = model('PreUser', preUserSchema);

export default PreUser;
