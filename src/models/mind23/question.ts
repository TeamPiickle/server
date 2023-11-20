import { model, Schema } from 'mongoose';
import IDocument from '../interface/Document';

interface IQuestion {
  content: string;
  tags: string[];
}

type QuestionDocument = IQuestion & IDocument;

const questionSchema = new Schema<QuestionDocument>({
  content: String,
  tags: [String]
});

const Question = model<QuestionDocument>('Question', questionSchema);

export default Question;

export { QuestionDocument };
