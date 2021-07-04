require("dotenv").config();

// framework
const { request, response } = require("express");
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/index");

// Model
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// initializing express
const shapeAi = express();

//configuration
shapeAi.use(express.json());

// Establish database connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }
    )
    .then(() => console.log("connection established !!!!!"));


/*
Route             /
Description      get all books
Access           PUBLIC
Parameters       NONE
Method           GET
*/

shapeAi.get("/", async (request, response) => {
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

shapeAi.get("/is/:isbn", async (request, response) => {

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
shapeAi.get("/c/:category", async (request, response) => {
    const getSpecificBooks = await BookModel.findOne({ category: request.params.category });
    if (!getSpecificBooks) {
        return response.json({ error: `No Book Found for the category of ${request.params.category} `, });
    }
    return response.json({ book: getSpecificBooks });

});

/*
Route            /author
Description      get all authors
Access           PUBLIC
Parameters       NONE
Method           GET
*/

shapeAi.get("/author", async (request, response) => {
    const getAllAuthors = await AuthorModel.find();
    return response.json({ authors: getAllAuthors });
});

/*
Route            /author
Description      get list of authors based on a book'S ISBN
Access           PUBLIC
Parameters       ISBN
Method           GET
*/

shapeAi.get("/author/:isbn", async (request, response) => {
    const getSpecificAuthors = await AuthorModel.findOne({ books: request.params.isbn });
    if (!getSpecificAuthors) {
        return response.json({ error: `No Author Found for the Books  ${request.params.isbn} `, });
    }
    return response.json({ authors: getSpecificAuthors });
});
/*
Route            /publications
Description      get all publication
Access           PUBLIC
Parameters       NONE
Method           GET
*/

shapeAi.get("/publications", async (request, response) => {
    const getAllPublications = await PublicationModel.find();
    return response.json({ publications: getAllPublications });
});
/*
Route            /publication
Description      get list of publications based on a book'S ISBN
Access           PUBLIC
Parameters       ISBN
Method           GET
*/

shapeAi.get("/publications/:isbn", async (request, response) => {
    const getSpecificPublications = await PublicationModel.find({ books: request.params.isbn });
    if (!getSpecificPublications) {
        return response.json({ error: `No Author Found for the Books  ${request.params.isbn} `, });
    }
    return response.json({ publications: getSpecificPublications });
});

/*
Route            /book/new
Description      add new book
Access           PUBLIC
Parameters       NONE
Method           POST
*/
shapeAi.post("/book/new", async (request, response) => {
    const { newBook } = request.body;
    const addNewBook = BookModel.create(newBook);

    return response.json({ books: addNewBook, message: "Book was added!!!" })
});

/*
Route            /author/new
Description      add new author
Access           PUBLIC
Parameters       NONE
Method           POST
*/

shapeAi.post("/author/new", async (request, response) => {
    const { newAuthor } = request.body;
    AuthorModel.create(newAuthor);
    return response.json({ message: "Author was added!!!" });
});

/*
Route            /publication/new
Description      add new author
Access           PUBLIC
Parameters       NONE
Method           POST
*/
shapeAi.post("/publication/new", async (request, response) => {
    const { newPublication } = request.body;
    PublicationModel.create(newPublication);
    return response.json({ message: "Publication was added!!!" })
});

/*
Route            /book/update
Description      update title of a book
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

shapeAi.put("/book/update/:isbn", async (request, response) => {
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
shapeAi.put("/book/author/update/:isbn", async (request, response) => {
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
Route            /publication/update/book
Description      update/add new book to a publication
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

shapeAi.put("/publication/update/book/:isbn", (request, response) => {
    // update the publicaton database
    database.publications.forEach((publication) => {
        if (publication.id === request.body.pubId) {
            return publication.books.push(request.params.isbn);
        }
    });
    // update  the book database
    database.books.forEach((book) => {
        if (book.ISBN === request.params.isbn) {
            book.publication = request.body.pubId;
            return;
        }
    });
    return response.json({ books: database.books, publications: database.publications, message: "succesfully update publication" });

});

/*
Route            /book/delete
Description      delete a book
Access           PUBLIC
Parameters       isbn
Method           DELETE
*/
shapeAi.delete("/book/delete/:isbn", async (request, response) => {
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
shapeAi.delete("/book/delete/author/:isbn/:authorId", async (request, response) => {
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

/*
Route            /publication/delete/book
Description      delete a book from a publication
Access           PUBLIC
Parameters       isbn,publication id
Method           DELETE
*/
shapeAi.delete("/publication/delete/book/:isbn/:pubId", async (req, res) => {
    // update publication database

    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const newBooksList = publication.books.filter((book) =>
                book !== req.params.isbn
            );
            publication.books = newBooksList;
            return;
        }
    });
   //update the Book database
   
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publication = 0;
            return;
        }
    });
    return res.json({ books: database.books, publications: database.publications, });

});

shapeAi.listen(3000, () => console.log("server is runing!!!!!!!"));