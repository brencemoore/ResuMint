const express = require("express");
const generationController = require("../controllers/generationController");

const objRouter = express.Router();

objRouter.post("/", generationController.generateResume);

module.exports = objRouter;
