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
    userId: command.userId,
    guestId: command.guestId
  });

  if (alreadyBallotResult) {
    if (
      alreadyBallotResult.ballotItemId.toString() ==
      command.ballotItemId.toString()
    ) {
      throw new IllegalArgumentException('이미 투표한 항목입니다.');
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
    userId: command.userId,
    guestId: command.guestId
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
  userId?: Types.ObjectId,
  guestId?: string
) => {
  const ballotTopic = await BallotTopic.findById(ballotTopicId);
  if (!ballotTopic) {
    throw new IllegalArgumentException('올바르지 않은 투표 주제 id 입니다.');
  }

  const ballotItems = await BallotItem.find({
    ballotTopicId: ballotTopicId
  });

  const userSelect: Nullable<BallotResultDocument> =
    userId || guestId
      ? await BallotResult.findOne({
          userId,
          ballotTopicId,
          guestId
        })
      : null;

  const ballotCount = await BallotResult.find({ ballotTopicId }).count();

  const ballotItemWithStatusList = await Promise.all(
    ballotItems.map(async (item: any) => {
      const status = userSelect
        ? await util.getStatus(ballotCount, item._id)
        : 0;
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
  if (!userId) {
    const randomBallotTopics = await BallotTopic.find().limit(4).sort('order');
    return randomBallotTopics;
  }
  const completedBallotTopic = await BallotResult.find(
    { userId },
    'ballotTopicId'
  );
  const completedIds = completedBallotTopic.map(e => e.ballotTopicId);
  const randomBallotTopicsExcludeCompleted = await BallotTopic.find({
    _id: { $nin: completedIds }
  })
    .limit(4)
    .sort('order');
  if (randomBallotTopicsExcludeCompleted.length < 4) {
    const randomBallotTopicsCompleted = await BallotTopic.find({
      _id: { $in: completedIds }
    })
      .limit(4 - randomBallotTopicsExcludeCompleted.length)
      .sort('order');
    return [
      ...randomBallotTopicsExcludeCompleted,
      ...randomBallotTopicsCompleted
    ];
  }
  return randomBallotTopicsExcludeCompleted;
};

export { createBallotResult, getMainBallotList, getBallotStatusAndUserSelect };
