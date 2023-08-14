const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./database/db");
const user = require("./routes/user");

const app = express();
const PORT = 3000;

connectDB();

app.use(bodyParser.json());

// Utiliza las rutas
app.use("/api", user);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
