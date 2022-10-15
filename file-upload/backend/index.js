const express = require("express");
const cors = require("cors");
const multer = require("multer");
const PORT = 3001;
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(cors());

app.get("/download", (req, res, next) => {
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  res.download("files/VirtualBox-6.1.38-153438-Win.exe", (error) => {
    if (error) {
      console.log("Error downloading file");
    } else {
      console.log("Files has been downloaded succesfully");
    }
  });
});

app.post("/upload", upload.single("file"), (req, res, next) => {
  const { path, originalname: fileName } = req.file;
  res.send({
    success: true,
    message: "file has been uploaded successfully",
    data: { path, fileName },
  });
});

app.listen(PORT, () => {
  console.log("Server is listing on port " + PORT);
});
