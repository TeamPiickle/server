import { IllegalArgumentException } from '../intefaces/exception';
import CreateBallotResultDto from '../intefaces/CreateBallotResultDto';
import BallotItem from '../models/ballotItem';
import { Types } from 'mongoose';
import util from '../modules/util';
import { BallotResult, BallotResultDocument } from '../models/ballotResult';
import { BallotTopic, BallotTopicDocument } from '../models/ballotTopic';
import { Nullable } from '../types/types';

const createBallotResult = async (command: CreateBallotResultDto) => {
  const ballotTopic = await BallotTopic.findById(command.ballotTopicId);
  if (!ballotTopic) {
    throw new IllegalArgumentException('올바르지 않은 투표 주제 id 입니다.');
  }

  const alreadyBallotResult = await BallotResult.findOne({
    ballotTopicId: command.ballotTopicId,
    userId: command.userId
  });

  if (alreadyBallotResult) {
    if (
      alreadyBallotResult.ballotItemId.toString() ==
      command.ballotItemId.toString()
    ) {
      await BallotResult.deleteOne({
        _id: alreadyBallotResult._id
      });
      return;
    }
    await BallotResult.findByIdAndUpdate(
      {
        _id: alreadyBallotResult._id
      },
      { ballotItemId: command.ballotItemId }
    );
    return;
  }

  const ballotItem = await BallotItem.findById(command.ballotItemId);
  if (!ballotItem) {
    throw new IllegalArgumentException('올바르지 않은 투표 항목 id 입니다.');
  }

  const newBallot = new BallotResult({
    ballotTopicId: ballotItem.ballotTopicId,
    ballotItemId: ballotItem._id,
    userId: command.userId
  });

  await newBallot.save();
};

const getSmallestOrderTopicIdGreaterThan = async (
  standard: number
): Promise<Types.ObjectId | undefined> => {
  const smallestOrderTopic = await BallotTopic.findOne()
    .where('order')
    .gt(standard)
    .sort({ order: 1 });
  return smallestOrderTopic?._id;
};

const getLargestOrderTopicIdLessThan = async (
  standard: number
): Promise<Types.ObjectId | undefined> => {
  const largestOrderTopic = await BallotTopic.findOne()
    .where('order')
    .lt(standard)
    .sort({ order: -1 });
  return largestOrderTopic?._id;
};

const getBallotStatusAndUserSelect = async (
  ballotTopicId: Types.ObjectId,
  userId?: Types.ObjectId
) => {
  const ballotTopic = await BallotTopic.findById(ballotTopicId);
  if (!ballotTopic) {
    throw new IllegalArgumentException('올바르지 않은 투표 주제 id 입니다.');
  }

  const ballotItems = await BallotItem.find({
    ballotTopicId: ballotTopicId
  });

  const userSelect: Nullable<BallotResultDocument> = userId
    ? await BallotResult.findOne({
        userId,
        ballotTopicId
      })
    : null;

  const ballotCount = await BallotResult.find({ ballotTopicId }).count();

  const ballotItemWithStatusList = await Promise.all(
    ballotItems.map(async (item: any) => {
      const status = userId ? await util.getStatus(ballotCount, item._id) : 0;
      const result = {
        _id: item._id,
        status: status,
        content: item.name
      };
      return result;
    })
  );

  const data = {
    ballotTopic: {
      _id: ballotTopicId,
      ballotTopicContent: ballotTopic.topic
    },
    ballotItems: ballotItemWithStatusList,
    userSelect,
    beforeTopicId: await getLargestOrderTopicIdLessThan(ballotTopic.order),
    nextTopicId: await getSmallestOrderTopicIdGreaterThan(ballotTopic.order)
  };

  return data;
};

const getMainBallotList = async (
  userId?: Types.ObjectId
): Promise<BallotTopicDocument[]> => {
  const resultCountsWithTopicId = (await BallotResult.aggregate()
    .sortByCount('ballotTopicId')
    .limit(10)) as { count: number; _id: Types.ObjectId }[];

  const ballots = await Promise.all(
    resultCountsWithTopicId.map(async resultCountWithTopicId => {
      return BallotTopic.findById(resultCountWithTopicId._id);
    })
  );

  return ballots.filter(util.isNotEmpty).slice(0, 4);
};

export { createBallotResult, getMainBallotList, getBallotStatusAndUserSelect };
