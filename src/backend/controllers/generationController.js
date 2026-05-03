const llmService = require("../services/llmService");
const { validateResumeData } = require("../services/validationService");

const generateResume = async (objRequest, objResponse, objNext) => {
  try {
    const objResumeData = objRequest.body.resumeData;
    const arrErrors = validateResumeData(objResumeData);

    if (arrErrors.length > 0) {
      objResponse.status(400).json({ errors: arrErrors });
      return;
    }

    const objGeneratedResume = await llmService.generateResume(objResumeData);
    objResponse.status(200).json(objGeneratedResume);
  } catch (objError) {
    if (objError.statusCode) {
      objResponse.status(objError.statusCode).json({
        error: objError.message,
        details: objError.details
      });
      return;
    }

    objNext(objError);
  }
};

module.exports = {
  generateResume
};
