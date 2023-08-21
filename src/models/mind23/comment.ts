import { model, Schema, Types } from 'mongoose';
import IDocument from '../interface/Document';

interface IComment {
  question: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
}

type CommentDocument = IComment & IDocument;

const commentSchema = new Schema<CommentDocument>(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    content: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Comment = model<CommentDocument>('Comment', commentSchema);

export default Comment;

export { CommentDocument };
