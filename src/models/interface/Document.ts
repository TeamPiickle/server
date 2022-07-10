import { Types } from 'mongoose';

interface IDocument {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IDocument;
