require("dotenv").config();

// framework
const { request, response } = require("express");
const express = require("express");
const mongoose = require("mongoose");

// Microservices Router
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications= require("./API/Publication");

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
    })
    .then(() => console.log("connection established !!!!!"));

// Initializing Microservices
shapeAi.use("/book", Books);
shapeAi.use("/author", Authors);
shapeAi.use("/publication", Publications);

shapeAi.listen(3000, () => console.log("server is runing!!!!!!!"));