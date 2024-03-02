const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db");
const user = require("./routes/user");
const branch = require("./routes/branch");

const app = express();
const PORT = 3000;
app.use(cors());

connectDB();

app.use(bodyParser.json());

// Utiliza las rutas
app.use("/api", user);
app.use("/api", branch);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
