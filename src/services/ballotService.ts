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
    userSelect
  };

  return data;
};

const getMainBallotList = async (
  userId?: Types.ObjectId
): Promise<BallotTopicDocument[]> => {
  if (!userId) {
    const randomBallotTopics = await BallotTopic.find()
      .sort({ order: 1 })
      .limit(4);
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
    .sort({ order: 1 })
    .limit(4);
  if (randomBallotTopicsExcludeCompleted.length < 4) {
    const randomBallotTopicsCompleted = await BallotTopic.find({
      _id: { $in: completedIds }
    })
      .sort({ order: 1 })
      .limit(4 - randomBallotTopicsExcludeCompleted.length);
    return [
      ...randomBallotTopicsExcludeCompleted,
      ...randomBallotTopicsCompleted
    ];
  }
  return randomBallotTopicsExcludeCompleted;
};

export { createBallotResult, getMainBallotList, getBallotStatusAndUserSelect };
