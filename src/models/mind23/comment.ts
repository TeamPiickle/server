import { model, Schema, Types } from 'mongoose';
import IDocument from '../interface/Document';

interface IComment {
  author: Types.ObjectId;
  content: string;
}

type CommentDocument = IComment & IDocument;

const commentSchema = new Schema<CommentDocument>(
  {
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
