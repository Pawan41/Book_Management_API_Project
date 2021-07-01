let books = [
    {
        ISBN: "12345ONE",
        title: "Getting staring with MERN",
        authors: [1, 2],
        language: "en",
        pubDate: "25-07-2021",
        numOfPage: 230,
        category: ["programing", "tech", "web dev", "app dev"],
        publication: 1,
    },
    {
        ISBN: "12345TWO",
        title: "Getting staring with Python",
        authors: [1, 2],
        language: "en",
        pubDate: "25-07-2021",
        numOfPage: 230,
        category: ["programing", "tech", "web dev", "app dev"],
        publication: 2,
    }
];


const authors = [
    {
        id: 1,
        name: "pawan",
        books: ["12345ONE"],
    },
    {
        id: 2,
        name: "sunil",
        books: ["12345TWO"],
    },
];

const publications = [
    {
        id: 1,
        name: "chakra",
        books: ["12345ONE"],
    },
    {
        id: 2,
        name: "jimi",
        books: ["12345TWO","12345ONE"],
    },
    
];

module.exports = { books, authors, publications };