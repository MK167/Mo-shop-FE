import { Category } from "./category";

export interface Product {
  autoID?: number;
  richDescription?: string;
  image?: string;
  images?: string[];
  brand?: string;
  price: number;
  rating?: number;
  numReviews?: any;
  isFeatured?: boolean;
  _id?: string;
  name?: string;
  description?: string;
  category?: Category;
  reviews?: Review[];
  countInStock?: number;
  __v?: number;
  dateCreated?: Date;
  id?: string;
}

export interface Review {
    avatar?: string;
    name?: string;
    review?: string;
}

