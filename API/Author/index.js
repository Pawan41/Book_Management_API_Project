//Initialize Express Router
const Router = require("express").Router();

// Database Model
const AuthorModel = require("../../database/author");

/*
Route            /author
Description      get all authors
Access           PUBLIC
Parameters       NONE
Method           GET
*/

Router.get("/", async (request, response) => {
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

Router.get("/:isbn", async (request, response) => {
    const getSpecificAuthors = await AuthorModel.findOne({ books: request.params.isbn });
    if (!getSpecificAuthors) {
        return response.json({ error: `No Author Found for the Books  ${request.params.isbn} `, });
    }
    return response.json({ authors: getSpecificAuthors });
});

/*
Route            /author/new
Description      add new author
Access           PUBLIC
Parameters       NONE
Method           POST
*/

Router.post("/new", async (request, response) => {
    const { newAuthor } = request.body;
    AuthorModel.create(newAuthor);
    return response.json({ message: "Author was added!!!" });
});

module.exports = Router;