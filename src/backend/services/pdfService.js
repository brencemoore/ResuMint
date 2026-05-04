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

const hasText = (strValue) => String(strValue || "").trim().length > 0;

const hasListItems = (arrItems) => Array.isArray(arrItems) && arrItems.some(hasText);

const hasEducationContent = (objEducation) => (
  hasText(objEducation.school) || hasText(objEducation.degree) || hasText(objEducation.start) || hasText(objEducation.end)
);

const hasExperienceContent = (objExperience) => (
  hasText(objExperience.company)
  || hasText(objExperience.role)
  || hasText(objExperience.start)
  || hasText(objExperience.end)
  || hasListItems(objExperience.bullets || [])
);

const hasProjectContent = (objProject) => {
  if (typeof objProject === "string") {
    return hasText(objProject);
  }

  return hasText(objProject.name) || hasText(objProject.description);
};

const renderDateRange = (strStart, strEnd) => {
  if (hasText(strStart) && hasText(strEnd)) {
    return `${escapeHtml(strStart)} - ${escapeHtml(strEnd)}`;
  }

  return escapeHtml(strStart || strEnd || "");
};

const renderSection = (strHeading, strBodyHtml) => {
  if (!hasText(strBodyHtml)) {
    return "";
  }

  return `
    <section aria-label="${escapeHtml(strHeading)}">
      <h2>${escapeHtml(strHeading)}</h2>
      ${strBodyHtml}
    </section>
  `;
};

const renderEducation = (arrEducation) => arrEducation.filter(hasEducationContent).map((objEducation) => `
  <article class="resume-item">
    <div class="resume-row">
      <h3>${escapeHtml(objEducation.school)}</h3>
      <p class="resume-date">${renderDateRange(objEducation.start, objEducation.end)}</p>
    </div>
    ${hasText(objEducation.degree) ? `<p>${escapeHtml(objEducation.degree)}</p>` : ""}
  </article>
`).join("");

const renderExperience = (arrExperience) => arrExperience.filter(hasExperienceContent).map((objExperience) => `
  <article class="resume-item">
    <div class="resume-row">
      <h3>${escapeHtml(objExperience.role)}${objExperience.company ? `, ${escapeHtml(objExperience.company)}` : ""}</h3>
      <p class="resume-date">${renderDateRange(objExperience.start, objExperience.end)}</p>
    </div>
    ${hasListItems(objExperience.bullets || []) ? `<ul>${renderList(objExperience.bullets || [])}</ul>` : ""}
  </article>
`).join("");

const renderProjects = (arrProjects) => arrProjects.filter(hasProjectContent).map((objProject) => {
  if (typeof objProject === "string") {
    return `<li>${escapeHtml(objProject)}</li>`;
  }

  return `<li><strong>${escapeHtml(objProject.name || "")}</strong>${objProject.description ? ` - ${escapeHtml(objProject.description)}` : ""}</li>`;
}).join("");

const renderContactLine = (objBasics) => [
  objBasics.email,
  objBasics.phone,
  objBasics.location,
  objBasics.github,
  objBasics.linkedin
].filter(Boolean).map(escapeHtml).join(" | ");

const buildResumeHtml = (objResumeData) => {
  const strTemplate = fs.readFileSync(strTemplatePath, "utf8");
  const strStyles = fs.readFileSync(strStylesPath, "utf8");
  const strExperience = renderExperience(objResumeData.experience || []);
  const strEducation = renderEducation(objResumeData.education || []);
  const strProjects = renderProjects(objResumeData.projects || []);
  const strSkills = renderList(objResumeData.skills || []);
  const strCertifications = renderList(objResumeData.certifications || []);

  return strTemplate
    .replace("{{styles}}", strStyles)
    .replace("{{name}}", escapeHtml(objResumeData.basics.name))
    .replace("{{contact}}", renderContactLine(objResumeData.basics))
    .replace("{{sections}}", [
      renderSection("Experience", strExperience),
      renderSection("Education", strEducation),
      renderSection("Projects", strProjects ? `<ul>${strProjects}</ul>` : ""),
      renderSection("Skills", strSkills ? `<ul class="skill-list">${strSkills}</ul>` : ""),
      renderSection("Certifications", strCertifications ? `<ul>${strCertifications}</ul>` : "")
    ].join(""));
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
