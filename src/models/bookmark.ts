import { model, Schema } from 'mongoose';
import IDocument from './interface/Document';
import IBookmark from './interface/IBookmark';

type BookmarkDocument = IBookmark & IDocument;

const bookmarkSchema = new Schema<BookmarkDocument>({
  cardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Bookmark = model('Bookmark', bookmarkSchema);

export default Bookmark;
