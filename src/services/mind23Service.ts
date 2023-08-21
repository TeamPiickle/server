import Question, { QuestionDocument } from '../models/mind23/question';
import Comment, { CommentDocument } from '../models/mind23/comment';
import { IllegalArgumentException } from '../intefaces/exception';
import PrizeEntry from '../models/mind23/prizeEntry';
import { Mind23CardResponseDto } from '../intefaces/mind23/Mind23CardResponseDto';
import { QuestionResponseDto } from '../intefaces/mind23/QuestionResponseDto';
import { CommentDto } from '../intefaces/mind23/CommentDto';
import { Types } from 'mongoose';
import User from '../models/user/user';

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

const createCommentResponse = async (
  comment: CommentDocument
): Promise<CommentDto> => {
  const user = await findUserInfo(comment.author);
  return {
    _id: comment.author,
    content: comment.content,
    profileImageUrl: user.profileImageUrl,
    nickname: user.nickname
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

const findCommentsList = async (questionId?: Types.ObjectId) => {
  const comments = (await Comment.aggregate()
    .match({
      question: questionId
    })
    .sort({ createdAt: -1 })) as CommentDocument[];
  const totalComments: CommentDto[] = [];
  for (const comment of comments) {
    totalComments.push(await createCommentResponse(comment));
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

const createPrizeEntry = async (userId?: Types.ObjectId) => {
  if (!userId) {
    throw new IllegalArgumentException('해당하는 아이디의 유저가 없습니다.');
  }
  const prizeEntry = new PrizeEntry({
    user: userId
  });
  await prizeEntry.save();
};

export { findQuestionList, findCommentsList, createComment, createPrizeEntry };
