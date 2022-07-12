import Category from '../models/category';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';

const getCategory = async (): Promise<Array<object> | null> => {
  const categories = await Category.find({}, { title: 1 });
  if (!categories) return null;

  return categories;
};

const getCards = async (
  categoryId: string
): Promise<CategoryResponseDto | null> => {
  const cards: CategoryResponseDto | null = await Category.findById(
    categoryId
  ).populate('cardIdList');
  if (!cards) return null;

  return cards;
};

const getMoviesBySearch = async (
  search: string,
  option: MovieOptionType,
  page: number
): Promise<MoviesResponseDto> => {
  const regex = (pattern: string) => new RegExp(`.*${pattern}.*`);

  let movies: MovieInfo[] = [];
  const perPage: number = 2;

  try {
    const titleRegex = regex(search);

    if (option === 'title') {
      movies = await Movie.find({ title: { $regex: titleRegex } })
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);
    } else if (option === 'director') {
      movies = await Movie.find({ director: { $regex: titleRegex } })
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);
    } else {
      movies = await Movie.find({
        $or: [
          { director: { $regex: titleRegex } },
          { title: { $regex: titleRegex } }
        ]
      })
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);
    }

    const total: number = await Movie.countDocuments({});
    const lastPage: number = Math.ceil(total / perPage);

    return {
      lastPage,
      movies
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getCategory,
  getCards,
  getMoviesBySearch
};
