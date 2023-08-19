import { model, Schema } from 'mongoose';
import IDocument from '../interface/Document';

interface IQuestion {
  content: string;
}

type QuestionDocument = IQuestion & IDocument;

const questionSchema = new Schema<QuestionDocument>({
  content: String
});

const Question = model<QuestionDocument>('Question', questionSchema);

export default Question;

export { QuestionDocument };
