import { IllegalArgumentException } from '../intefaces/exception';
import CreateBallotResultDto from '../intefaces/CreateBallotResultDto';
import BallotItem from '../models/ballotItem';
import { BallotResult } from '../models/ballotResult';
import { BallotTopic, BallotTopicDocument } from '../models/ballotTopic';
import mongoose from 'mongoose';

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

const getMainBallotList = async (
  userId: mongoose.Types.ObjectId | null
): Promise<BallotTopicDocument[]> => {
  if (userId) {
    const completedBallotTopicIds: mongoose.Types.ObjectId[] =
      await BallotResult.find({ userId }, 'ballotTopicId');
    const randomBallotTopicsExcludeCompleted = await BallotTopic.find({
      _id: { $nin: completedBallotTopicIds }
    }).limit(4);
    return randomBallotTopicsExcludeCompleted;
  } else {
    const randomBallotTopics = await BallotTopic.find().limit(4);
    return randomBallotTopics;
  }
};

export { createBallotResult, getMainBallotList };
