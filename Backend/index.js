import "dotenv/config";
// make express app
// attach port to it

import express, { json } from "express";
import connectToDb from "./src/connectToDb/connectToDb.js";
import productRouter from "./src/routes/productRouter.js";
import cors from "cors";
import bookRouter from "./src/routes/bookRouter.js";

let app = express();

app.listen(8000, () => {
  console.log(`<---- Apllication is listening at 8000 ---->`);
  connectToDb();
});
// npm i cors
app.use(cors());
app.use(json()); //make our system capable to take json data , always place it at top
app.use("/api/product", productRouter);
app.use("/api/book", bookRouter);

// send bad input back as a readable JSON message instead of an HTML error page
app.use((err, req, res, next) => {
  const badInput = err.name === "ValidationError" || err.name === "CastError";
  res.status(badInput ? 400 : 500).json({
    success: false,
    message: err.message,
  });
});
// app.get("/tests", test);

/* 
Schema -data structure define
model
router
index - define router to express app

*/
