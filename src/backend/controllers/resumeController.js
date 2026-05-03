const resumeService = require("../services/resumeService");
const { validateResumeRequest } = require("../services/validationService");

const parseResumeId = (strResumeId) => {
  const intResumeId = Number.parseInt(strResumeId, 10);
  return Number.isInteger(intResumeId) && intResumeId > 0 ? intResumeId : null;
};

const listResumes = async (objRequest, objResponse, objNext) => {
  try {
    const strSearch = typeof objRequest.query.search === "string" ? objRequest.query.search : "";
    const arrResumes = await resumeService.listResumes(strSearch);
    objResponse.status(200).json(arrResumes);
  } catch (objError) {
    objNext(objError);
  }
};

const getResume = async (objRequest, objResponse, objNext) => {
  try {
    const intResumeId = parseResumeId(objRequest.params.id);

    if (!intResumeId) {
      objResponse.status(400).json({ error: "Resume id must be a positive number." });
      return;
    }

    const objResume = await resumeService.getResumeById(intResumeId);

    if (!objResume) {
      objResponse.status(404).json({ error: "Resume was not found." });
      return;
    }

    // GET routes return arrays per the project testing instructions.
    objResponse.status(200).json([objResume]);
  } catch (objError) {
    objNext(objError);
  }
};

const createResume = async (objRequest, objResponse, objNext) => {
  try {
    const arrErrors = validateResumeRequest(objRequest.body);

    if (arrErrors.length > 0) {
      objResponse.status(400).json({ errors: arrErrors });
      return;
    }

    const objResume = await resumeService.createResume(objRequest.body);
    objResponse.status(201).json(objResume);
  } catch (objError) {
    objNext(objError);
  }
};

const updateResume = async (objRequest, objResponse, objNext) => {
  try {
    const intResumeId = parseResumeId(objRequest.params.id);

    if (!intResumeId) {
      objResponse.status(400).json({ error: "Resume id must be a positive number." });
      return;
    }

    const arrErrors = validateResumeRequest(objRequest.body);

    if (arrErrors.length > 0) {
      objResponse.status(400).json({ errors: arrErrors });
      return;
    }

    const objResume = await resumeService.updateResume(intResumeId, objRequest.body);

    if (!objResume) {
      objResponse.status(404).json({ error: "Resume was not found." });
      return;
    }

    objResponse.status(200).json(objResume);
  } catch (objError) {
    objNext(objError);
  }
};

const deleteResume = async (objRequest, objResponse, objNext) => {
  try {
    const intResumeId = parseResumeId(objRequest.params.id);

    if (!intResumeId) {
      objResponse.status(400).json({ error: "Resume id must be a positive number." });
      return;
    }

    const blnDeleted = await resumeService.deleteResume(intResumeId);

    if (!blnDeleted) {
      objResponse.status(404).json({ error: "Resume was not found." });
      return;
    }

    objResponse.status(204).send();
  } catch (objError) {
    objNext(objError);
  }
};

module.exports = {
  createResume,
  deleteResume,
  getResume,
  listResumes,
  updateResume
};
