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
    await BallotResult.deleteOne({
      _id: alreadyBallotResult._id
    });
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

const getBallotStatus = async (ballotTopicId: Types.ObjectId) => {
  const ballotTopic = await BallotTopic.findById(ballotTopicId);
  if (!ballotTopic) {
    throw new IllegalArgumentException('올바르지 않은 투표 주제 id 입니다.');
  }
  const ballotItems = await BallotItem.find({
    BallotTopicId: ballotTopicId
  });
  const ballotStatus = ballotItems.map((item: any) => {
    const result = {
      _id: item._id,
      content: item.name
    };
    return result;
  });
  const data = {
    ballotItems: ballotStatus
  };
  return data;
};

const getBallotStatusAndUserSelect = async (
  userId: Types.ObjectId,
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
  if (!ballotSelectCheck) {
    return getBallotStatus(ballotTopicId);
  }

  const ballotItems = await BallotItem.find({
    BallotTopicId: ballotTopicId
  });

  const ballotCount = await BallotResult.find(ballotTopicId).count();
  const ballotStatus = await Promise.all(
    ballotItems.map(async (item: any) => {
      const result = {
        _id: item._id,
        status: await util.getStatus(ballotCount, item._id),
        content: item.name
      };
      return result;
    })
  );
  const data = {
    ballotItems: ballotStatus,
    userSelect: await BallotResult.findOne(
      {
        userId: userId,
        ballotTopicId: ballotTopicId
      },
      { ballotItemId: 1 }
    )
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
    const randomBallotTopicsExcludeCompleted = await BallotTopic.find({
      _id: { $nin: completedBallotTopic.map(e => e.ballotTopicId) }
    }).limit(4);
    return randomBallotTopicsExcludeCompleted;
  } else {
    const randomBallotTopics = await BallotTopic.find().limit(4);
    return randomBallotTopics;
  }
};

export {
  createBallotResult,
  getMainBallotList,
  getBallotStatusAndUserSelect,
  getBallotStatus
};
