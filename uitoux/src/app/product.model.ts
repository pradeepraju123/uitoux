// product.model.ts

export interface Product {
    _id: string;
    partNumber: string;
    name: string;
    actualPrice: number;
    discountedPrice: number;
    topRated: boolean;
    specialOffer: boolean;
    bestSeller: boolean;
    image: string;
    reviews: Review[];
    starRating: number;
  }
  
  export interface Review {
    review: string;
    starRating: number;
  }
  