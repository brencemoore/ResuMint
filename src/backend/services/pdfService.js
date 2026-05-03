const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { validateResumeData } = require("./validationService");

const strTemplatePath = path.resolve(__dirname, "..", "..", "templates", "resumeTemplate.html");
const strStylesPath = path.resolve(__dirname, "..", "..", "templates", "resumeTemplate.css");

const escapeHtml = (strValue = "") => String(strValue)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const renderList = (arrItems) => arrItems
  .filter((strItem) => String(strItem).trim().length > 0)
  .map((strItem) => `<li>${escapeHtml(strItem)}</li>`)
  .join("");

const renderEducation = (arrEducation) => arrEducation.map((objEducation) => `
  <article class="resume-item">
    <div class="resume-row">
      <h3>${escapeHtml(objEducation.school)}</h3>
      <p>${escapeHtml(objEducation.start)} - ${escapeHtml(objEducation.end)}</p>
    </div>
    <p>${escapeHtml(objEducation.degree)}</p>
  </article>
`).join("");

const renderExperience = (arrExperience) => arrExperience.map((objExperience) => `
  <article class="resume-item">
    <div class="resume-row">
      <h3>${escapeHtml(objExperience.role)}${objExperience.company ? `, ${escapeHtml(objExperience.company)}` : ""}</h3>
      <p>${escapeHtml(objExperience.start)} - ${escapeHtml(objExperience.end)}</p>
    </div>
    <ul>${renderList(objExperience.bullets || [])}</ul>
  </article>
`).join("");

const renderProjects = (arrProjects) => arrProjects.map((objProject) => {
  if (typeof objProject === "string") {
    return `<li>${escapeHtml(objProject)}</li>`;
  }

  return `<li><strong>${escapeHtml(objProject.name || "")}</strong>${objProject.description ? ` - ${escapeHtml(objProject.description)}` : ""}</li>`;
}).join("");

const buildResumeHtml = (objResumeData) => {
  const strTemplate = fs.readFileSync(strTemplatePath, "utf8");
  const strStyles = fs.readFileSync(strStylesPath, "utf8");

  return strTemplate
    .replace("{{styles}}", strStyles)
    .replace("{{name}}", escapeHtml(objResumeData.basics.name))
    .replace("{{contact}}", [
      objResumeData.basics.email,
      objResumeData.basics.phone,
      objResumeData.basics.location
    ].filter(Boolean).map(escapeHtml).join(" | "))
    .replace("{{experience}}", renderExperience(objResumeData.experience || []))
    .replace("{{education}}", renderEducation(objResumeData.education || []))
    .replace("{{projects}}", renderProjects(objResumeData.projects || []))
    .replace("{{skills}}", renderList(objResumeData.skills || []))
    .replace("{{certifications}}", renderList(objResumeData.certifications || []));
};

const createPdfBuffer = async (objResumeData) => {
  const arrErrors = validateResumeData(objResumeData);

  if (arrErrors.length > 0) {
    const objError = new Error("Resume data is invalid.");
    objError.statusCode = 400;
    objError.details = arrErrors;
    throw objError;
  }

  const strHtml = buildResumeHtml(objResumeData);
  const objBrowser = await puppeteer.launch({ headless: "new" });

  try {
    const objPage = await objBrowser.newPage();
    await objPage.setContent(strHtml, { waitUntil: "networkidle0" });

    const objPdfBytes = await objPage.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in"
      }
    });

    // Puppeteer may return a Uint8Array depending on the installed version.
    // Express sends Node Buffers as real binary files, so this conversion keeps
    // the downloaded resume from becoming corrupted JSON-like byte data.
    return Buffer.from(objPdfBytes);
  } finally {
    await objBrowser.close();
  }
};

module.exports = {
  createPdfBuffer
};
