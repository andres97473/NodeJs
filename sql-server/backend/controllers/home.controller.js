const path = require("path");

function render(file, res) {
  return res.sendFile(path.join(__dirname + `/../views/${file}.html`));
}

class HomeController {
  async index(req, res) {
    res.json({ message: "Hello World" });
  }
}

module.exports = new HomeController();
