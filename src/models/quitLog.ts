import { Schema, model } from 'mongoose';

const quitLogSchema = new Schema(
  {
    reason: String
  },
  {
    timestamps: true
  }
);

const QuitLog = model('QuitLog', quitLogSchema);
export default QuitLog;
