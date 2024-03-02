const { httpError } = require("../helpers/handleError");
const userModel = require("../models/users");

const getItems = async (req, res) => {
  try {
    const listAll = await userModel.find();
    res.send({ data: listAll });
  } catch (e) {
    httpError(res, e);
  }
};

const getItemId = (req, res) => {};

const createItem = async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const resDetail = await userModel.create({
      name,
      age,
      email,
    });

    res.send({ data: resDetail });
  } catch (e) {
    httpError(res, e);
  }
};

const updateItem = (req, res) => {};

const deleteItem = (req, res) => {};

module.exports = {
  getItems,
  getItemId,
  createItem,
  updateItem,
  deleteItem,
};
