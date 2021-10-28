const express = require("express");
const server = express();
const cors = require("cors");
const { Technology } = require("../models");

// middlewares
server.use(express.json());
server.use(express.static(__dirname + "/../public"));
server.use(cors());

// endpoint /api/technologies
server.get("/api/technologies", async (req, res) => {
  let technologies = await Technology.find();
  technologies = technologies.map((technology) => {
    technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;
    return technology;
  });
  return res.send({ error: false, data: technologies });
});

// endpoint /api/technology/:id
server.get("/api/technology/:id", async (req, res) => {
  const { id } = req.params;
  let technology = await Technology.findById(id);
  technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;
  return res.send({ error: false, data: technology });
});

// endpoint /api/technology/search/:name
server.get("/api/technology/search/:name", async (req, res) => {
  const { name } = req.params;
  let technologies = await Technology.find({
    name: { $regex: new RegExp(name, "i") },
  });
  technologies = technologies.map((technology) => {
    technology.logo = `${req.protocol}://${req.headers.host}/img/${technology.logo}`;
    return technology;
  });
  return res.send({ error: false, data: technologies });
});

module.exports = server;
