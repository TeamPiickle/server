import { Schema, model } from "mongoose";
import IDocument from "./interface/Document";
import IEmailAuth from "./interface/IEmailAuth";

type EmailAuthDocument = IEmailAuth & IDocument;
const emailAuthSchema = new Schema<EmailAuthDocument>({
  email: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  expiresIn: {
    type: Date,
    required: true,
  },
  code: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const EmailAuth = model<EmailAuthDocument>('EmailAuth', emailAuthSchema);
export default EmailAuth;