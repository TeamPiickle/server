import { IllegalArgumentException } from '../intefaces/exception';
import CreateBallotResultDto from '../intefaces/CreateBallotResultDto';
import BallotItem from '../models/ballotItem';
import { Types } from 'mongoose';
import util from '../modules/util';
import { BallotResult } from '../models/ballotResult';
import { BallotTopic, BallotTopicDocument } from '../models/ballotTopic';

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
  userId: Types.ObjectId | undefined,
  ballotTopicId: Types.ObjectId
) => {
  const ballotSelectCheck = await BallotResult.findOne({
    userId: userId,
    ballotTopicId: ballotTopicId
  });
  const ballotTopic = await BallotTopic.findById(ballotTopicId);
  if (!ballotTopic) {
    throw new IllegalArgumentException('올바르지 않은 투표 주제 id 입니다.');
  }

  const ballotItems = await BallotItem.find({
    ballotTopicId: ballotTopicId
  });

  const ballotCount = await BallotResult.find(ballotTopicId).count();
  const ballotStatus = await Promise.all(
    ballotItems.map(async (item: any) => {
      let status = await util.getStatus(ballotCount, item._id);
      if (!status) {
        status = 0;
      }
      const result = {
        _id: item._id,
        status: status,
        content: item.name
      };
      return result;
    })
  );
  let userSelect = null;

  if (ballotSelectCheck) {
    userSelect = await BallotResult.findOne(
      {
        userId: userId,

        ballotTopicId: ballotTopicId
      },
      { ballotItemId: 1 }
    );
  }

  const data = {
    ballotTopic: {
      _id: ballotTopicId,
      ballotTopicContent: ballotTopic.topic
    },
    ballotItems: ballotStatus,
    userSelect: userSelect
  };

  return data;
};

const getMainBallotList = async (
  userId: Types.ObjectId | null
): Promise<BallotTopicDocument[]> => {
  if (userId) {
    const completedBallotTopic = await BallotResult.find(
      { userId },
      'ballotTopicId'
    );
    const completedIds = completedBallotTopic.map(e => e.ballotTopicId);
    const randomBallotTopicsExcludeCompleted = await BallotTopic.find({
      _id: { $nin: completedIds }
    }).limit(4);
    if (randomBallotTopicsExcludeCompleted.length < 4) {
      const randomBallotTopicsCompleted = await BallotTopic.find({
        _id: { $in: completedIds }
      }).limit(4 - randomBallotTopicsExcludeCompleted.length);
      return [
        ...randomBallotTopicsExcludeCompleted,
        ...randomBallotTopicsCompleted
      ];
    }
    return randomBallotTopicsExcludeCompleted;
  } else {
    const randomBallotTopics = await BallotTopic.find().limit(4);
    return randomBallotTopics;
  }
};

export { createBallotResult, getMainBallotList, getBallotStatusAndUserSelect };
