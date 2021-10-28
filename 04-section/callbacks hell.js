const booksDb = [{
        id: 1,
        title: "Clean code",
        authorId: 1,
    },
    {
        id: 2,
        title: "The pragmantic programer",
        authorId: 2,
    },
    {
        id: 3,
        title: "Web Development with Node.js",
        authorId: 3,
    },
];

const authorsDb = [{
        id: 1,
        name: "Thomas C. Martin",
    },
    {
        id: 2,
        name: "Steve Forest",
    },
];

function getBookByID(id, callback) {
    const book = booksDb.find((book) => book.id === id);
    if (!book) {
        const err = new Error();
        err.message = "Book not found!";
        return callback(err);
    }
    callback(null, book);
}

function getAuthorByID(id, callback) {
    const author = authorsDb.find((author) => author.id === id);
    if (!author) {
        const err = new Error();
        err.message = "Author not found!";
        return callback(err);
    }
    callback(null, author);
}

getBookByID(3, (err, book) => {
    if (err) {
        console.log(err.message);
    }
    getAuthorByID(book.authorId, (err, author) => {
        if (err) {
            console.log(err.message);
        }
        console.log(`El autor es ${author.name}`);
    });
    console.log(book);
});