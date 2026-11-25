import expressAsyncHandler from "express-async-handler";
import { Book } from "../schema/model.js";

export const createBook = expressAsyncHandler(async (req, res) => {
  const result = await Book.create(req.body);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    result: result,
  });
});

export const readBook = expressAsyncHandler(async (req, res) => {
  const result = await Book.find();
  res.status(200).json({
    success: true,
    message: "Book read successfully",
    result: result,
  });
});

export const readSpecificBook = expressAsyncHandler(async (req, res) => {
  const result = await Book.findById(req.params.id);
  res.status(200).json({
    success: true,
    message: "Book read successfully",
    result: result,
  });
});

export const updateBookController = expressAsyncHandler(async (req, res) => {
  // reviews are added through their own route, not overwritten by an edit
  const { reviews, ...changes } = req.body;
  const result = await Book.findByIdAndUpdate(req.params.id, changes, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    message: "Book Updated sucessfully",
    result: result,
  });
});

export const deleteBook = expressAsyncHandler(async (req, res) => {
  const result = await Book.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    result: result,
  });
});

export const addReview = expressAsyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  const { reviewer, rating, comment } = req.body;
  book.reviews.push({ reviewer, rating, comment });
  await book.save();
  res.status(201).json({
    success: true,
    message: "Review added successfully",
    result: book,
  });
});
