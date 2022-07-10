import { model, Schema } from 'mongoose';
import IDocument from './interface/Document';
import ICategory from './interface/ICategory';

type CategoryDocument = ICategory & IDocument;

const categorySchema = new Schema<CategoryDocument>({
  title: {
    type: String,
    required: true
  },
  cardIdList: [Schema.Types.ObjectId]
});

const Category = model<CategoryDocument>('Category', categorySchema);

export default Category;
