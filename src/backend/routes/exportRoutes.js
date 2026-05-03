const express = require("express");
const exportController = require("../controllers/exportController");

const objRouter = express.Router();

objRouter.post("/pdf", exportController.exportPdf);

module.exports = objRouter;
