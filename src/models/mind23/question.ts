import { model, Schema } from 'mongoose';
import IDocument from '../interface/Document';

interface IQuestion {
  content: string;
  essential: Boolean;
}

type QuestionDocument = IQuestion & IDocument;

const questionSchema = new Schema<QuestionDocument>({
  content: String,
  essential: Boolean
});

const Question = model<QuestionDocument>('Question', questionSchema);

export default Question;

export { QuestionDocument };
