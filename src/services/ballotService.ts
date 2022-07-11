import { IllegalArgumentException, IllegalStateException } from '../intefaces/common';
import CreateBallotResultDto from '../intefaces/CreateBallotResultDto';
import BallotItem from '../models/ballotItem';
import { BallotResult } from '../models/ballotResult';


const createBallotResult = async (command: CreateBallotResultDto) => {
  const alreadyBallotResult = await BallotResult.findOne({
    ballotTopicId: command.ballotTopicId,
    userId: command.userId
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
    userId: command.userId
  });
  
  await newBallot.save();
};

export default { createBallotResult };
