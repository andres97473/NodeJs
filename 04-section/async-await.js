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

async function getBookByID(id) {
    const book = booksDb.find((book) => book.id === id);
    if (!book) {
        const err = new Error();
        err.message = "Book not found!";
        throw err;
    }
    return book;
}

async function getAuthorByID(id) {
    const author = authorsDb.find((author) => author.id === id);
    if (!author) {
        const err = new Error();
        err.message = "Author not found!";
        throw err;
    }
    return author;
}

async function main() {
    try {
        const book = await getBookByID(3);
        const author = await getAuthorByID(book.authorId);

        console.log(`Este libro ${book.title} fue escrito por ${author.name}`);
    } catch (error) {
        console.log(error.message);
    }
}

main();