const booksDb = [{
        id: 1,
        title: "Clean code",
    },
    {
        id: 2,
        title: "The pragmantic programer",
    },
    {
        id: 3,
        title: "Web Development with Node.js",
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

getBookByID(20, (err, book) => {
    if (err) {
        console.log(err.message);
    }
    console.log(book);
});