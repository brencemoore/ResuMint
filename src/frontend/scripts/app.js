const objState = {
  intCurrentResumeId: null,
  arrResumes: [],
  intEducationCount: 0,
  intExperienceCount: 0,
  intProjectCount: 0
};

const objElements = {
  addEducationButton: document.getElementById("addEducationButton"),
  addExperienceButton: document.getElementById("addExperienceButton"),
  addProjectButton: document.getElementById("addProjectButton"),
  basicNameInput: document.getElementById("basicNameInput"),
  certificationsInput: document.getElementById("certificationsInput"),
  companyTargetInput: document.getElementById("companyTargetInput"),
  currentResumeStatus: document.getElementById("currentResumeStatus"),
  educationContainer: document.getElementById("educationContainer"),
  emailInput: document.getElementById("emailInput"),
  experienceContainer: document.getElementById("experienceContainer"),
  exportPdfButton: document.getElementById("exportPdfButton"),
  generateResumeButton: document.getElementById("generateResumeButton"),
  jobTitleInput: document.getElementById("jobTitleInput"),
  locationInput: document.getElementById("locationInput"),
  messageBox: document.getElementById("messageBox"),
  newResumeButton: document.getElementById("newResumeButton"),
  phoneInput: document.getElementById("phoneInput"),
  projectsContainer: document.getElementById("projectsContainer"),
  resumeForm: document.getElementById("resumeForm"),
  resumeList: document.getElementById("resumeList"),
  resumeListStatus: document.getElementById("resumeListStatus"),
  resumeNameInput: document.getElementById("resumeNameInput"),
  saveResumeButton: document.getElementById("saveResumeButton"),
  searchForm: document.getElementById("searchForm"),
  searchInput: document.getElementById("searchInput"),
  skillsInput: document.getElementById("skillsInput")
};

const getEmptyResumeData = () => ({
  basics: {
    name: "",
    email: "",
    phone: "",
    location: ""
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: []
});

const setMessage = (strMessage, strType = "secondary") => {
  objElements.messageBox.className = `alert alert-${strType} mb-0`;
  objElements.messageBox.textContent = strMessage;
};

const createFormInput = (strId, strLabel, strValue = "", strType = "text") => `
  <div class="col-12 col-md-6">
    <label class="form-label" for="${strId}">${strLabel}</label>
    <input class="form-control" id="${strId}" name="${strId}" type="${strType}" value="${escapeAttribute(strValue)}" aria-label="${strLabel}">
  </div>
`;

const escapeAttribute = (strValue = "") => String(strValue)
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const splitCommaList = (strValue) => strValue
  .split(",")
  .map((strItem) => strItem.trim())
  .filter((strItem) => strItem.length > 0);

const addEducationItem = (objEducation = {}) => {
  objState.intEducationCount += 1;
  const intIndex = objState.intEducationCount;
  const objWrapper = document.createElement("fieldset");

  objWrapper.className = "border rounded p-3 mb-3";
  objWrapper.dataset.educationItem = "true";
  objWrapper.innerHTML = `
    <legend class="float-none w-auto px-2 h6">Education ${intIndex}</legend>
    <div class="row g-3">
      ${createFormInput(`educationSchool${intIndex}`, "School", objEducation.school || "")}
      ${createFormInput(`educationDegree${intIndex}`, "Degree", objEducation.degree || "")}
      ${createFormInput(`educationStart${intIndex}`, "Start date", objEducation.start || "")}
      ${createFormInput(`educationEnd${intIndex}`, "End date", objEducation.end || "")}
      <div class="col-12">
        <button class="btn btn-outline-danger btn-sm" type="button" data-remove-item="true">Remove Education</button>
      </div>
    </div>
  `;

  objElements.educationContainer.appendChild(objWrapper);
};

const addExperienceItem = (objExperience = {}) => {
  objState.intExperienceCount += 1;
  const intIndex = objState.intExperienceCount;
  const objWrapper = document.createElement("fieldset");

  objWrapper.className = "border rounded p-3 mb-3";
  objWrapper.dataset.experienceItem = "true";
  objWrapper.innerHTML = `
    <legend class="float-none w-auto px-2 h6">Experience ${intIndex}</legend>
    <div class="row g-3">
      ${createFormInput(`experienceCompany${intIndex}`, "Company", objExperience.company || "")}
      ${createFormInput(`experienceRole${intIndex}`, "Role", objExperience.role || "")}
      ${createFormInput(`experienceStart${intIndex}`, "Start date", objExperience.start || "")}
      ${createFormInput(`experienceEnd${intIndex}`, "End date", objExperience.end || "")}
      <div class="col-12">
        <label class="form-label" for="experienceBullets${intIndex}">Bullet points, one per line</label>
        <textarea class="form-control" id="experienceBullets${intIndex}" name="experienceBullets${intIndex}" rows="5" aria-label="Experience bullet points">${escapeAttribute((objExperience.bullets || []).join("\n"))}</textarea>
      </div>
      <div class="col-12">
        <button class="btn btn-outline-danger btn-sm" type="button" data-remove-item="true">Remove Experience</button>
      </div>
    </div>
  `;

  objElements.experienceContainer.appendChild(objWrapper);
};

const addProjectItem = (objProject = {}) => {
  objState.intProjectCount += 1;
  const intIndex = objState.intProjectCount;
  const objProjectData = typeof objProject === "string" ? { name: objProject, description: "" } : objProject;
  const objWrapper = document.createElement("fieldset");

  objWrapper.className = "border rounded p-3 mb-3";
  objWrapper.dataset.projectItem = "true";
  objWrapper.innerHTML = `
    <legend class="float-none w-auto px-2 h6">Project ${intIndex}</legend>
    <div class="row g-3">
      ${createFormInput(`projectName${intIndex}`, "Project name", objProjectData.name || "")}
      <div class="col-12">
        <label class="form-label" for="projectDescription${intIndex}">Project description</label>
        <textarea class="form-control" id="projectDescription${intIndex}" name="projectDescription${intIndex}" rows="4" aria-label="Project description">${escapeAttribute(objProjectData.description || "")}</textarea>
      </div>
      <div class="col-12">
        <button class="btn btn-outline-danger btn-sm" type="button" data-remove-item="true">Remove Project</button>
      </div>
    </div>
  `;

  objElements.projectsContainer.appendChild(objWrapper);
};

const resetRepeatingSections = () => {
  objState.intEducationCount = 0;
  objState.intExperienceCount = 0;
  objState.intProjectCount = 0;
  objElements.educationContainer.innerHTML = "";
  objElements.experienceContainer.innerHTML = "";
  objElements.projectsContainer.innerHTML = "";
};

const fillForm = (objResume = null) => {
  const objResumeData = objResume?.resumeData || getEmptyResumeData();

  objState.intCurrentResumeId = objResume?.id || null;
  objElements.resumeNameInput.value = objResume?.name || "Untitled Resume";
  objElements.jobTitleInput.value = objResume?.jobTitle || "";
  objElements.companyTargetInput.value = objResume?.companyTarget || "";
  objElements.basicNameInput.value = objResumeData.basics.name || "";
  objElements.emailInput.value = objResumeData.basics.email || "";
  objElements.phoneInput.value = objResumeData.basics.phone || "";
  objElements.locationInput.value = objResumeData.basics.location || "";
  objElements.skillsInput.value = (objResumeData.skills || []).join(", ");
  objElements.certificationsInput.value = (objResumeData.certifications || []).join(", ");

  resetRepeatingSections();
  (objResumeData.education || []).forEach(addEducationItem);
  (objResumeData.experience || []).forEach(addExperienceItem);
  (objResumeData.projects || []).forEach(addProjectItem);

  objElements.currentResumeStatus.textContent = objState.intCurrentResumeId
    ? `Editing resume ${objResume.name}.`
    : "Creating a new resume.";
};

const readInputValue = (objContainer, strSelector) => {
  const objInput = objContainer.querySelector(strSelector);
  return objInput ? objInput.value.trim() : "";
};

const collectResumeData = () => {
  const arrEducation = Array.from(objElements.educationContainer.querySelectorAll("[data-education-item='true']")).map((objItem) => ({
    school: readInputValue(objItem, "input[id^='educationSchool']"),
    degree: readInputValue(objItem, "input[id^='educationDegree']"),
    start: readInputValue(objItem, "input[id^='educationStart']"),
    end: readInputValue(objItem, "input[id^='educationEnd']")
  }));

  const arrExperience = Array.from(objElements.experienceContainer.querySelectorAll("[data-experience-item='true']")).map((objItem) => ({
    company: readInputValue(objItem, "input[id^='experienceCompany']"),
    role: readInputValue(objItem, "input[id^='experienceRole']"),
    start: readInputValue(objItem, "input[id^='experienceStart']"),
    end: readInputValue(objItem, "input[id^='experienceEnd']"),
    bullets: readInputValue(objItem, "textarea[id^='experienceBullets']").split("\n").map((strBullet) => strBullet.trim()).filter(Boolean)
  }));

  const arrProjects = Array.from(objElements.projectsContainer.querySelectorAll("[data-project-item='true']")).map((objItem) => ({
    name: readInputValue(objItem, "input[id^='projectName']"),
    description: readInputValue(objItem, "textarea[id^='projectDescription']")
  }));

  return {
    basics: {
      name: objElements.basicNameInput.value.trim(),
      email: objElements.emailInput.value.trim(),
      phone: objElements.phoneInput.value.trim(),
      location: objElements.locationInput.value.trim()
    },
    education: arrEducation,
    experience: arrExperience,
    projects: arrProjects,
    skills: splitCommaList(objElements.skillsInput.value),
    certifications: splitCommaList(objElements.certificationsInput.value)
  };
};

const collectResumePayload = () => ({
  name: objElements.resumeNameInput.value.trim(),
  jobTitle: objElements.jobTitleInput.value.trim(),
  companyTarget: objElements.companyTargetInput.value.trim(),
  resumeData: collectResumeData()
});

const renderResumeList = () => {
  objElements.resumeList.innerHTML = "";
  objElements.resumeListStatus.textContent = `${objState.arrResumes.length} resume${objState.arrResumes.length === 1 ? "" : "s"} found.`;

  objState.arrResumes.forEach((objResume) => {
    const objItem = document.createElement("div");
    objItem.className = `list-group-item${objResume.id === objState.intCurrentResumeId ? " active" : ""}`;
    objItem.innerHTML = `
      <div class="d-flex align-items-start justify-content-between gap-2">
        <button class="btn btn-link p-0 text-start ${objResume.id === objState.intCurrentResumeId ? "text-white" : ""}" type="button" data-resume-id="${objResume.id}" aria-label="Load ${escapeAttribute(objResume.name)}">
          <span class="fw-semibold d-block">${escapeAttribute(objResume.name)}</span>
          <span class="small d-block">${escapeAttribute(objResume.jobTitle || "No target role")}</span>
        </button>
        <button class="btn btn-sm ${objResume.id === objState.intCurrentResumeId ? "btn-light" : "btn-outline-danger"}" type="button" data-delete-resume-id="${objResume.id}" aria-label="Delete ${escapeAttribute(objResume.name)}">Delete</button>
      </div>
    `;
    objElements.resumeList.appendChild(objItem);
  });
};

const requestJson = async (strUrl, objOptions = {}) => {
  const objResponse = await fetch(strUrl, {
    headers: {
      "Content-Type": "application/json",
      ...(objOptions.headers || {})
    },
    ...objOptions
  });

  if (!objResponse.ok) {
    const objErrorBody = await objResponse.json().catch(() => ({ error: "Request failed." }));
    throw new Error(objErrorBody.error || (objErrorBody.errors || []).join(" ") || "Request failed.");
  }

  if (objResponse.status === 204) {
    return null;
  }

  return objResponse.json();
};

const loadResumeList = async () => {
  const strSearch = encodeURIComponent(objElements.searchInput.value.trim());
  objState.arrResumes = await requestJson(`/api/resumes?search=${strSearch}`);
  renderResumeList();
};

const loadResume = async (intResumeId) => {
  const arrResumes = await requestJson(`/api/resumes/${intResumeId}`);
  fillForm(arrResumes[0]);
  renderResumeList();
  setMessage("Resume loaded.", "success");
};

const saveResume = async () => {
  if (!objElements.resumeNameInput.value.trim()) {
    objElements.resumeNameInput.focus();
    setMessage("Resume name is required before saving.", "warning");
    return;
  }

  const objPayload = collectResumePayload();
  const strUrl = objState.intCurrentResumeId ? `/api/resumes/${objState.intCurrentResumeId}` : "/api/resumes";
  const strMethod = objState.intCurrentResumeId ? "PUT" : "POST";
  const objSavedResume = await requestJson(strUrl, {
    method: strMethod,
    body: JSON.stringify(objPayload)
  });

  fillForm(objSavedResume);
  await loadResumeList();
  setMessage("Resume saved locally.", "success");
};

const deleteResume = async (intResumeId) => {
  const objResume = objState.arrResumes.find((objExistingResume) => objExistingResume.id === intResumeId);
  const strResumeName = objResume?.name || "this resume";

  if (!window.confirm(`Delete ${strResumeName}? This cannot be undone.`)) {
    return;
  }

  await requestJson(`/api/resumes/${intResumeId}`, { method: "DELETE" });

  if (objState.intCurrentResumeId === intResumeId) {
    fillForm();
  }

  await loadResumeList();
  setMessage("Resume deleted.", "success");
};

const generateResume = async () => {
  setMessage("Generating polished resume content with Groq.", "secondary");

  const objGeneratedResumeData = await requestJson("/api/generate", {
    method: "POST",
    body: JSON.stringify({ resumeData: collectResumeData() })
  });

  const objCurrentResume = collectResumePayload();
  fillForm({
    id: objState.intCurrentResumeId,
    name: objCurrentResume.name,
    jobTitle: objCurrentResume.jobTitle,
    companyTarget: objCurrentResume.companyTarget,
    resumeData: objGeneratedResumeData
  });
  setMessage("Generated content was added to the form. Review it, then save when ready.", "success");
};

const exportPdf = async () => {
  setMessage("Creating PDF locally.", "secondary");

  const objResponse = await fetch("/api/export/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ resumeData: collectResumeData() })
  });

  if (!objResponse.ok) {
    const objErrorBody = await objResponse.json().catch(() => ({ error: "PDF export failed." }));
    throw new Error(objErrorBody.error || "PDF export failed.");
  }

  const objBlob = await objResponse.blob();
  const strDownloadUrl = URL.createObjectURL(objBlob);
  const objLink = document.createElement("a");

  objLink.href = strDownloadUrl;
  objLink.download = `${(objElements.basicNameInput.value || "resume").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-resumint.pdf`;
  document.body.appendChild(objLink);
  objLink.click();
  objLink.remove();

  // The download starts from a temporary browser URL. Waiting briefly before
  // revoking it gives the browser time to begin reading the PDF bytes.
  window.setTimeout(() => URL.revokeObjectURL(strDownloadUrl), 1000);
  setMessage("PDF exported.", "success");
};

const handleAsyncAction = async (fnAction) => {
  try {
    await fnAction();
  } catch (objError) {
    setMessage(objError.message, "danger");
  }
};

const switchTab = (objSelectedTab) => {
  document.querySelectorAll("[role='tab']").forEach((objTab) => {
    const blnSelected = objTab === objSelectedTab;
    const objPanel = document.getElementById(objTab.dataset.tabTarget);

    objTab.classList.toggle("active", blnSelected);
    objTab.setAttribute("aria-selected", String(blnSelected));
    objPanel.classList.toggle("d-none", !blnSelected);
    objPanel.hidden = !blnSelected;
  });
};

document.getElementById("editorTabs").addEventListener("click", (objEvent) => {
  const objTab = objEvent.target.closest("[role='tab']");

  if (objTab) {
    switchTab(objTab);
  }
});

[objElements.educationContainer, objElements.experienceContainer, objElements.projectsContainer].forEach((objContainer) => {
  objContainer.addEventListener("click", (objEvent) => {
    const objButton = objEvent.target.closest("[data-remove-item='true']");

    if (objButton) {
      objButton.closest("fieldset").remove();
      setMessage("Section removed. Save the resume to keep this change.", "secondary");
    }
  });
});

objElements.addEducationButton.addEventListener("click", () => addEducationItem());
objElements.addExperienceButton.addEventListener("click", () => addExperienceItem());
objElements.addProjectButton.addEventListener("click", () => addProjectItem());
objElements.newResumeButton.addEventListener("click", () => {
  fillForm();
  renderResumeList();
  setMessage("New resume started.", "secondary");
});
objElements.saveResumeButton.addEventListener("click", () => handleAsyncAction(saveResume));
objElements.generateResumeButton.addEventListener("click", () => handleAsyncAction(generateResume));
objElements.exportPdfButton.addEventListener("click", () => handleAsyncAction(exportPdf));
objElements.searchForm.addEventListener("submit", (objEvent) => {
  objEvent.preventDefault();
  handleAsyncAction(loadResumeList);
});
objElements.resumeList.addEventListener("click", (objEvent) => {
  const objDeleteButton = objEvent.target.closest("[data-delete-resume-id]");
  const objButton = objEvent.target.closest("[data-resume-id]");

  if (objDeleteButton) {
    handleAsyncAction(() => deleteResume(Number.parseInt(objDeleteButton.dataset.deleteResumeId, 10)));
    return;
  }

  if (objButton) {
    handleAsyncAction(() => loadResume(Number.parseInt(objButton.dataset.resumeId, 10)));
  }
});

fillForm();
handleAsyncAction(loadResumeList);
