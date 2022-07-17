import { BallotResult } from '../models/ballotResult';
import { Types } from 'mongoose';

const util = {
  success: (status: number, message: string, data?: any) => {
    return {
      status,
      success: true,
      message,
      data
    };
  },
  fail: (status: number, message: string, data?: any) => {
    return {
      status,
      success: false,
      message
    };
  },
  getLastMonth: (): Date => {
    const beforeAMonth = new Date();
    beforeAMonth.setMonth(beforeAMonth.getMonth() - 1);
    return beforeAMonth;
  },

  getStatus: async (
    ballotCount: number,
    ballotItemId: Types.ObjectId
  ): Promise<number> => {
    return Math.floor(
      ((await BallotResult.find({
        ballotItemId: ballotItemId
      }).count()) *
        100) /
        ballotCount
    );
  }
};

export default util;
