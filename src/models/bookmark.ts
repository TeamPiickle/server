import { model, Schema } from 'mongoose';
import IDocument from './interface/Document';
import IBookmark from './interface/IBookmark';

type BookmarkDocument = IBookmark & IDocument;

const bookmarkSchema = new Schema<BookmarkDocument>(
  {
    card: {
      type: Schema.Types.ObjectId,
      ref: 'Card'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Bookmark = model('Bookmark', bookmarkSchema);

export default Bookmark;
