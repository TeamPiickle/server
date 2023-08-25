import Question, { QuestionDocument } from '../models/mind23/question';
import Comment, { CommentDocument } from '../models/mind23/comment';
import { IllegalArgumentException } from '../intefaces/exception';
import PrizeEntry from '../models/mind23/prizeEntry';
import { Mind23CardResponseDto } from '../intefaces/mind23/Mind23CardResponseDto';
import { QuestionResponseDto } from '../intefaces/mind23/QuestionResponseDto';
import { CommentDto } from '../intefaces/mind23/CommentDto';
import { Types } from 'mongoose';
import User from '../models/user/user';

const NICKNAME_LIMIT = 8;
const findUserInfo = async (userId?: Types.ObjectId) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new IllegalArgumentException('해당하는 아이디의 유저가 없습니다.');
  }
  return user;
};

const createCardResponse = (
  question: QuestionDocument
): Mind23CardResponseDto => {
  return {
    _id: question._id,
    content: question.content,
    tags: [],
    category: [],
    filter: [],
    isBookmark: false,
    essential: question.essential
  };
};

const checkCommentStatus = (
  authorId: Types.ObjectId,
  userId?: Types.ObjectId
): Boolean => {
  if (!userId) {
    return false;
  }
  return userId.toString() === authorId.toString();
};

const createCommentResponse = async (
  comment: CommentDocument,
  userId?: Types.ObjectId
): Promise<CommentDto> => {
  const user = await findUserInfo(comment.author);
  return {
    _id: comment._id,
    authorId: comment.author,
    content: comment.content,
    profileImageUrl: user.profileImageUrl,
    nickname: user.nickname.slice(0, NICKNAME_LIMIT),
    commentStatus: checkCommentStatus(comment.author, userId)
  };
};

const findQuestionList = async (): Promise<QuestionResponseDto> => {
  const questions = await Question.find({});
  const totalCards: Mind23CardResponseDto[] = questions.map(question =>
    createCardResponse(question)
  );
  const count = await PrizeEntry.find({}).count();
  return {
    totalCount: count,
    cards: totalCards
  };
};

const findCommentsList = async (
  userId?: Types.ObjectId,
  questionId?: Types.ObjectId
) => {
  const comments = (await Comment.aggregate()
    .match({
      question: questionId
    })
    .sort({ createdAt: -1 })) as CommentDocument[];
  const totalComments: CommentDto[] = [];
  for (const comment of comments) {
    totalComments.push(await createCommentResponse(comment, userId));
  }
  return totalComments;
};

const createComment = async (
  userId?: Types.ObjectId,
  questionId?: Types.ObjectId,
  content?: string
) => {
  if (!userId) {
    throw new IllegalArgumentException('해당하는 아이디의 유저가 없습니다.');
  }
  const comment = new Comment({
    question: questionId,
    author: userId,
    content: content
  });
  await comment.save();
};

const createPrizeEntry = async (
  userId?: Types.ObjectId,
  prizeEntryStatus?: Boolean
) => {
  if (!userId) {
    throw new IllegalArgumentException('해당하는 아이디의 유저가 없습니다.');
  }
  console.log(prizeEntryStatus);
  const prizeEntry = new PrizeEntry({
    user: userId,
    prizeEntryStatus: prizeEntryStatus
  });
  await prizeEntry.save();
};

export { findQuestionList, findCommentsList, createComment, createPrizeEntry };
