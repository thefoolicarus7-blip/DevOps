import { Route, Routes } from "react-router-dom";
import CreateForm from "./src/component/CreateForm";
import ReadAll from "./src/component/ReadAll";
import UpdateForm from "./src/component/UpdateForm";
import ReadSpecific from "./src/component/ReadSpecific";
import Library from "./src/books/Library";
import BookDetail from "./src/books/BookDetail";
import BookForm from "./src/books/BookForm";

const NavRoute = () => {
  return (
    <Routes>
      {/* book review app */}
      <Route path="/" element={<Library />}></Route>
      <Route path="/books/new" element={<BookForm />}></Route>
      <Route path="/books/:id" element={<BookDetail />}></Route>
      <Route path="/books/:id/edit" element={<BookForm />}></Route>

      {/* old product pages, no longer in the menu */}
      <Route path="/create" element={<CreateForm />}></Route>
      <Route path="/read" element={<ReadAll />}></Route>
      <Route path="/readSpecific/:id" element={<ReadSpecific />}></Route>
      <Route path="/update/:id" element={<UpdateForm />}></Route>

      <Route
        path="*"
        element={
          <main className="page">
            <p className="notice">That page doesn't exist. Use the menu to get back to the shelf.</p>
          </main>
        }
      ></Route>
    </Routes>
  );
};

export default NavRoute;
