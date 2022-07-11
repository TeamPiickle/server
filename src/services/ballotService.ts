import { IllegalArgumentException, IllegalStateException } from '../intefaces/common';
import CreateBallotResultDto from '../intefaces/CreateBallotResultDto';
import BallotItem from '../models/ballotItem';
import { BallotResult } from '../models/ballotResult';
import BallotTopic from '../models/ballotTopic';


const createBallotResult = async (command: CreateBallotResultDto) => {
  const ballotTopic = await BallotTopic.findById(command.ballotTopicId)
  if (!ballotTopic) {
    throw new IllegalArgumentException('올바르지 않은 투표 주제 id 입니다.');
  }
  
  const alreadyBallotResult = await BallotResult.findOne({
    ballotTopicId: command.ballotTopicId,
    userId: command.user.id
  });

  if (alreadyBallotResult) {
    await BallotResult.deleteOne({
      _id: alreadyBallotResult._id
    })
  };

  const ballotItem = await BallotItem.findById(command.ballotItemId);
  if (!ballotItem) {
    throw new IllegalArgumentException('올바르지 않은 투표 항목 id 입니다.');
  }

  const newBallot = new BallotResult({
    ballotTopicId: ballotItem.ballotTopicId,
    ballotItemId: ballotItem._id,
    userId: command.user.id
  });
  
  await newBallot.save();
};

export default { createBallotResult };
