const isPlainObject = (objValue) => (
  objValue !== null && typeof objValue === "object" && !Array.isArray(objValue)
);

const isStringValue = (strValue) => typeof strValue === "string";

const validateResumeData = (objResumeData) => {
  const arrErrors = [];

  if (!isPlainObject(objResumeData)) {
    return ["Resume data must be a JSON object."];
  }

  if (!isPlainObject(objResumeData.basics)) {
    arrErrors.push("Basics must be provided.");
  } else {
    ["name", "email", "phone", "location"].forEach((strFieldName) => {
      if (!isStringValue(objResumeData.basics[strFieldName])) {
        arrErrors.push(`Basics ${strFieldName} must be text.`);
      }
    });
  }

  ["education", "experience", "projects", "skills", "certifications"].forEach((strArrayName) => {
    if (!Array.isArray(objResumeData[strArrayName])) {
      arrErrors.push(`${strArrayName} must be an array.`);
    }
  });

  if (Array.isArray(objResumeData.education)) {
    objResumeData.education.forEach((objEducation, intIndex) => {
      ["school", "degree", "start", "end"].forEach((strFieldName) => {
        if (!isPlainObject(objEducation) || !isStringValue(objEducation[strFieldName])) {
          arrErrors.push(`Education item ${intIndex + 1} ${strFieldName} must be text.`);
        }
      });
    });
  }

  if (Array.isArray(objResumeData.experience)) {
    objResumeData.experience.forEach((objExperience, intIndex) => {
      ["company", "role", "start", "end"].forEach((strFieldName) => {
        if (!isPlainObject(objExperience) || !isStringValue(objExperience[strFieldName])) {
          arrErrors.push(`Experience item ${intIndex + 1} ${strFieldName} must be text.`);
        }
      });

      if (!isPlainObject(objExperience) || !Array.isArray(objExperience.bullets)) {
        arrErrors.push(`Experience item ${intIndex + 1} bullets must be an array.`);
      }
    });
  }

  return arrErrors;
};

const validateResumeRequest = (objBody) => {
  const arrErrors = [];

  if (!isPlainObject(objBody)) {
    return ["Request body must be a JSON object."];
  }

  if (!isStringValue(objBody.name) || objBody.name.trim().length === 0) {
    arrErrors.push("Resume name is required.");
  }

  if (!isStringValue(objBody.jobTitle)) {
    arrErrors.push("Job title must be text.");
  }

  if (!isStringValue(objBody.companyTarget)) {
    arrErrors.push("Company target must be text.");
  }

  arrErrors.push(...validateResumeData(objBody.resumeData));
  return arrErrors;
};

module.exports = {
  validateResumeData,
  validateResumeRequest
};
