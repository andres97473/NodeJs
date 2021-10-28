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

function getBookByID(id) {
    return new Promise((resolve, reject) => {
        const book = booksDb.find((book) => book.id === id);
        if (!book) {
            const err = new Error();
            err.message = "Book not found!";
            reject(err);
        }
        resolve(book);
    });
}

function getAuthorByID(id) {
    return new Promise((resolve, reject) => {
        const author = authorsDb.find((author) => author.id === id);
        if (!author) {
            const err = new Error();
            err.message = "Author not found!";
            reject(err);
        }
        resolve(author);
    });
}

getBookByID(1)
    .then((book) => {
        console.log(book);
        return getAuthorByID(book.authorId);
    })
    .then((author) => {
        console.log(author);
    })
    .catch((err) => {
        console.log(err.message);
    });