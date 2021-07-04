//Initialize Express Router
const Router = require("express").Router();

// Database Model
const PublicationModel = require("../../database/publication");

/*
Route            /publications
Description      get all publication
Access           PUBLIC
Parameters       NONE
Method           GET
*/

Router.get("/", async (request, response) => {
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

Router.get("/:isbn", async (request, response) => {
    const getSpecificPublications = await PublicationModel.find({ books: request.params.isbn });
    if (!getSpecificPublications) {
        return response.json({ error: `No Author Found for the Books  ${request.params.isbn} `, });
    }
    return response.json({ publications: getSpecificPublications });
});


/*
Route            /publication/new
Description      add new author
Access           PUBLIC
Parameters       NONE
Method           POST
*/
Router.post("/new", async (request, response) => {
    const { newPublication } = request.body;
    PublicationModel.create(newPublication);
    return response.json({ message: "Publication was added!!!" })
});

/*
Route            /publication/update/book
Description      update/add new book to a publication
Access           PUBLIC
Parameters       isbn
Method           PUT
*/

Router.put("/update/book/:isbn", (request, response) => {
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
Route            /publication/delete/book
Description      delete a book from a publication
Access           PUBLIC
Parameters       isbn,publication id
Method           DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
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

module.exports = Router;