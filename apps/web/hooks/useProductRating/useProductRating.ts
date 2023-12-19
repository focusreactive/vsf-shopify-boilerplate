import { Product } from '~/sdk/shopify/types';

const RATING = 5;
const RATING_COUNT = 5;

type ProductRating = {
  rating: number;
  ratingCount: number;
};

const useProductRating = (product: Product | null | undefined): ProductRating => {
  if (!product) {
    return { rating: 0, ratingCount: 1 };
  }

  return { rating: RATING, ratingCount: RATING_COUNT };
};

export default useProductRating;
