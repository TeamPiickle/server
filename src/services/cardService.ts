import Bookmark from '../models/bookmark';
import Card, { CardDocument } from '../models/card';
import util from '../modules/util';
import { Types } from 'mongoose';
import { CardResponseDto } from '../intefaces/CardResponseDto';
interface CardIdAndCnt {
  _id: Types.ObjectId;
  count: number;
}

const findBestDummy = async (
  userId: Types.ObjectId | undefined,
  size: number
) => {
  const topics = [
    'SOPT에서 얻은\n가장 소중한 인연은?',
    '절친 동생이랑 연애\nVS\n동생 절친이랑 연애',
    '내가 선호하는 주종과 \n나의 주량은?',
    '사생활 노출\nVS\n노출로 생활',
    '만약 힘들게 취업한 회사의\n상사가 전남친이라면?',
    '만약 내가 다른\nMBTI가 될 수 있다면?',
    '상대방의 mbti를\n맞춰보세요!',
    '고양이상과 강아지상 중, \n나의 취향은?',
    '사주나 신점을 \n믿는다 VS 안믿는다',
    '여기서 결혼을 제일\n빨리 할 것 같은 사람은?',
    '이 중 썸탄 경험이\n많은 사람은\n누구인가요?',
    '매일 아침, 눈을 뜬 다음\n나의 모닝 루틴은?',
    '나만 아는 숨겨진 맛집!\n한 곳만 알려주실래요?',
    '서투른 애인\nVS\n능숙한 애인',
    '연애할 때, 중요도는\n성격 VS 외모',
    '사랑과 우정 중\n하나를 택해야한다면?\n당신의 선택과 이유는?',
    '주변환경과 본인의 의지\n둘 중 무엇이 \n삶에 더 큰 영향을\n끼친다고 생각하세요?',
    '최고의 복수는\n성공이라는 말에\n동의하시나요?\n그 이유는?',
    '시간을 돌릴 수 있다면, \n언제로 돌아가고 싶은가요?',
    '발표를 망쳤을 때\n위로와 격려받기\nVS \n냉철한 피드백 받기',
    '내가 생각하는 이상적인 애인 \n또는 연애에 대해 말해주세요',
    '여기서 차기 파트장\n할 것 같은 사람 고르기',
    '자신의\n인생 영화작\n말해주기',
    '결혼을 하고 싶나요?\n만약 한다면, 언제쯤?',
    '상대방을 보면 떠오르는 \n색깔을 말해주세요!',
    '최애가수 1명과\n그 이유를\n말해주세요!',
    '싸웠을 때,\n시간이 필요한가요\n당장 풀기를 원하나요?',
    '이성친구 립밤 빌려주는 애인\nVS\n이성친구 빨대 같이쓰는 애인'
  ];
  let count = 0;
  const dummyList: CardResponseDto[] = [];
  for (const item of topics) {
    const dummyCard = await Card.find({
      content: item
    });
    console.log(item);
    dummyList[count] = {
      _id: dummyCard[0]._id,
      content: dummyCard[0].content,
      tags: dummyCard[0].tags,
      category: dummyCard[0].category,
      filter: dummyCard[0].filter
    };
    count++;
  }
  const data = await Promise.all(
    dummyList.map(async (item: any) => {
      const isBookmark =
        (await Bookmark.find({ user: userId, card: item._id }).count()) > 0
          ? true
          : false;
      return {
        _id: item._id,
        content: item.content,
        tags: item.tags,
        category: item.Category,
        filter: item.filter,
        isBookmark: isBookmark
      };
    })
  );
  return data;
};

const findBestCards = async (
  userId: Types.ObjectId | undefined,
  size: number
) => {
  const cardIdAndCnt = <CardIdAndCnt[]>await Bookmark.aggregate([
    { $match: { createdAt: { $gte: util.getLastMonth() } } }
  ])
    .sortByCount('card')
    .limit(size);
  let cards: CardDocument[] = [];
  let cardList: CardResponseDto[] = [];
  if (cardIdAndCnt.length > 0) {
    cards = <CardDocument[]>await Promise.all(
      cardIdAndCnt.map(async c => {
        return Card.findById(c._id);
      })
    );
    cardList = await Promise.all(
      cards.map(async (item: any) => {
        const isBookmark =
          (await Bookmark.find({ user: userId, card: item._id }).count()) > 0
            ? true
            : false;
        return {
          _id: item._id,
          content: item.content,
          tags: item.tags,
          category: item.Category,
          filter: item.filter,
          isBookmark: isBookmark
        };
      })
    );
  }

  let extraCard: CardResponseDto[] = [];
  if (cards.length < size) {
    extraCard = await Card.find({ _id: { $nin: cards.map(c => c._id) } }).limit(
      size - cards.length
    );
  }

  const extraCardList = await Promise.all(
    extraCard.map(async (item: any) => {
      const isBookmark =
        (await Bookmark.find({ user: userId, card: item._id }).count()) > 0
          ? true
          : false;
      return {
        _id: item._id,
        content: item.content,
        tags: item.tags,
        category: item.Category,
        filter: item.filter,
        isBookmark: isBookmark
      };
    })
  );
  return [...cardList, ...extraCardList];
};
export { findBestCards, findBestDummy };
