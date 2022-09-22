import { Schema, model } from 'mongoose';

enum QuitReason {
  NO_INTEREST = '마음에 드는 주제가 없어요',
  INCONVENIENT_TO_USE = '이용이 불편해요',
  OTHER_SERVICE = '다른 서비스나 제품을 더 자주 이용해요',
  RARELY_USE = '잘 사용하지 않아요',
  ETC = '기타'
}

const quitLogSchema = new Schema(
  {
    reasons: [
      {
        type: String,
        enum: QuitReason
      }
    ]
  },
  {
    timestamps: true
  }
);

const QuitLog = model('QuitLog', quitLogSchema);
export default QuitLog;

export { QuitReason };
