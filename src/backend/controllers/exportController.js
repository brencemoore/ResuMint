const pdfService = require("../services/pdfService");
const { validateResumeData } = require("../services/validationService");

const exportPdf = async (objRequest, objResponse, objNext) => {
  try {
    const objResumeData = objRequest.body.resumeData;
    const arrErrors = validateResumeData(objResumeData);

    if (arrErrors.length > 0) {
      objResponse.status(400).json({ errors: arrErrors });
      return;
    }

    const objPdfBuffer = await pdfService.createPdfBuffer(objResumeData);
    const strSafeName = (objResumeData.basics.name || "resume").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

    objResponse.status(200);
    objResponse.setHeader("Content-Type", "application/pdf");
    objResponse.setHeader("Content-Disposition", `attachment; filename="${strSafeName}-resumint.pdf"`);
    objResponse.send(objPdfBuffer);
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
  exportPdf
};
