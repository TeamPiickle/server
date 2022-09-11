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
    if (ballotCount == 0) return 0;
    return Math.floor(
      ((await BallotResult.find({
        ballotItemId
      }).count()) *
        100) /
        ballotCount
    );
  },

  stringToDate: (strDate: string) => {
    const splitedDate = strDate.split(' ');
    const validStr =
      splitedDate[0].substring(0, 4) +
      '-' +
      splitedDate[1].substring(0, 2) +
      '-' +
      splitedDate[2].substring(0, 2);
    return new Date(validStr);
  }
};

export default util;
