import { Router } from "express";
import {
  addReview,
  createBook,
  deleteBook,
  readBook,
  readSpecificBook,
  updateBookController,
} from "../controller/bookController.js";

const bookRouter = Router();
//    "/""=localhost:8000/api/book;

bookRouter.route("/").post(createBook).get(readBook);

//    "/""=localhost:8000/api/book/:id;
bookRouter
  .route("/:id")
  .get(readSpecificBook)
  .patch(updateBookController)
  .delete(deleteBook);

//    localhost:8000/api/book/:id/reviews
bookRouter.route("/:id/reviews").post(addReview);

//update
//id -req.params.id
// data -req.body

export default bookRouter;
