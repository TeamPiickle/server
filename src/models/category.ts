import { model, Schema, Types } from 'mongoose';
import IDocument from './interface/Document';
import ICategory from './interface/ICategory';

type CategoryDocument = ICategory & IDocument;

const categorySchema = new Schema<CategoryDocument>({
  title: {
    type: String,
    required: true
  },
  cardIdList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Card'
    }
  ]
});

const Category = model<CategoryDocument>('Category', categorySchema);

export default Category;
