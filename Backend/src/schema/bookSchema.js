import { Schema } from "mongoose";

const reviewSchema = Schema(
  {
    reviewer: {
      type: String,
      required: [true, "reviewer name is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [1, "rating must be between 1 and 5"],
      max: [5, "rating must be between 1 and 5"],
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const bookSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    author: {
      type: String,
    },
    publication: {
      type: String,
    },
    genre: {
      type: String,
    },
    description: {
      type: String,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  { timestamps: true },
);
export default bookSchema;
