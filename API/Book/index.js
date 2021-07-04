// Prefix : /book

//Initialize Express Router
const Router = require("express").Router();

// Database Model
const BookModel =require("../../database/book");
/*
Route             /
Description      get all books
Access           PUBLIC
Parameters       NONE
Method           GET
*/

Router.get("/", async (request, response) => {
    const getAllBooks = await BookModel.find();
    return response.json(getAllBooks);
});

/*
Route            /is
Description      get spectific book based on ISBN
Access           PUBLIC
Parameters       isbn
Method           GET
*/

Router.get("/is/:isbn", async (request, response) => {

    const getSpecificBook = await BookModel.findOne({ ISBN: request.params.isbn });
    if (!getSpecificBook) {
        return response.json({ error: `No Book Found for the ISBN of ${request.params.isbn} `, });
    }
    return response.json({ book: getSpecificBook });
});

/*
Route            /c/
Description      get specific book based  on a category
Access           PUBLIC
Parameters       category
Method           GET
*/
Router.get("/c/:category", async (request, response) => {
    const getSpecificBooks = await BookModel.findOne({ category: request.params.category });
    if (!getSpecificBooks) {
        return response.json({ error: `No Book Found for the category of ${request.params.category} `, });
    }
    return response.json({ book: getSpecificBooks });

});

/*
Route            /book/new
Description      add new book
Access           PUBLIC
Parameters       NONE
Method           POST
*/
Router.post("/new", async (request, response) => {
    const { newBook } = request.body;
    const addNewBook = BookModel.create(newBook);
    return response.json({ books: addNewBook, message: "Book was added!!!" })
});

/*
Route            /book/update
Description      update title of a book
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

Router.put("/update/:isbn", async (request, response) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: request.params.isbn, },
        { title: request.body.bookTitle, },
        { new: true, }
    );
    return response.json({ books: updatedBook });
});
/*
Route            /book/author/update
Description      update/add new author 
Access           PUBLIC
Parameters       isbn
Method           PUT
*/
Router.put("/author/update/:isbn", async (request, response) => {
    //update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: request.params.isbn, },
        {
            $addToSet:
                { authors: request.body.newAuthor, },
        },
        { new: true, }

    );

    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        { id: request.body.newAuthor, },
        {
            $addToSet: { books: request.params.isbn, },
        },
        { new: true, }
    );
    return response.json({ books: updatedBook, authors: updatedAuthor, message: "New author was added" });
});

/*
Route            /book/delete
Description      delete a book
Access           PUBLIC
Parameters       isbn
Method           DELETE
*/
Router.delete("/delete/:isbn", async (request, response) => {
    const updatedBookDatebase = await BookModel.findOneAndDelete({
        ISBN: request.params.isbn,
    });
    return response.json({ books: updatedBookDatebase });

});
/*
Route            /book/delete/author
Description      delete a author from a book
Access           PUBLIC
Parameters       isbn,author id
Method           DELETE
*/
Router.delete("/delete/author/:isbn/:authorId", async (request, response) => {
    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {   //find the book  
            ISBN: request.params.isbn,
        },
        {
            $pull:
                { authors: parseInt(request.params.authorId), },
        },
        { new: true, },
    );

    // update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        { id: parseInt(request.params.authorId), },
        {
            $pull:
                { books: request.params.isbn, },
        },
        { new: true, },
    );
    return response.json({ message: "delete a author from a book ", book: updatedBook, author: updatedAuthor, });
});

module.exports = Router;
