const express = require("express");
const resumeController = require("../controllers/resumeController");

const objRouter = express.Router();

objRouter.get("/", resumeController.listResumes);
objRouter.post("/", resumeController.createResume);
objRouter.get("/:id", resumeController.getResume);
objRouter.put("/:id", resumeController.updateResume);
objRouter.delete("/:id", resumeController.deleteResume);

module.exports = objRouter;
