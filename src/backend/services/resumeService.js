const { allQuery, getQuery, runQuery } = require("../db/database");
const { getEmptyResumeData } = require("../models/resumeModel");

const mapResumeRow = (objRow) => {
  if (!objRow) {
    return null;
  }

  return {
    id: objRow.id,
    name: objRow.name,
    jobTitle: objRow.job_title,
    companyTarget: objRow.company_target,
    createdAt: objRow.created_at,
    updatedAt: objRow.updated_at,
    resumeData: objRow.json_data ? JSON.parse(objRow.json_data) : getEmptyResumeData()
  };
};

const listResumes = async (strSearch = "") => {
  const strSearchTerm = `%${strSearch.trim()}%`;
  const arrRows = await allQuery(
    `SELECT id, name, job_title, company_target, created_at, updated_at
     FROM resumes
     WHERE name LIKE ?
     ORDER BY updated_at DESC`,
    [strSearchTerm]
  );

  return arrRows.map((objRow) => ({
    id: objRow.id,
    name: objRow.name,
    jobTitle: objRow.job_title,
    companyTarget: objRow.company_target,
    createdAt: objRow.created_at,
    updatedAt: objRow.updated_at
  }));
};

const getResumeById = async (intResumeId) => {
  const objRow = await getQuery(
    `SELECT resumes.id, resumes.name, resumes.job_title, resumes.company_target,
            resumes.created_at, resumes.updated_at, resume_data.json_data
     FROM resumes
     LEFT JOIN resume_data ON resume_data.resume_id = resumes.id
     WHERE resumes.id = ?`,
    [intResumeId]
  );

  return mapResumeRow(objRow);
};

const createResume = async (objResumeInput) => {
  const objCreateResult = await runQuery(
    `INSERT INTO resumes (name, job_title, company_target)
     VALUES (?, ?, ?)`,
    [
      objResumeInput.name.trim(),
      objResumeInput.jobTitle.trim(),
      objResumeInput.companyTarget.trim()
    ]
  );

  await runQuery(
    `INSERT INTO resume_data (resume_id, json_data)
     VALUES (?, ?)`,
    [objCreateResult.intLastId, JSON.stringify(objResumeInput.resumeData)]
  );

  return getResumeById(objCreateResult.intLastId);
};

const updateResume = async (intResumeId, objResumeInput) => {
  const objExistingResume = await getResumeById(intResumeId);

  if (!objExistingResume) {
    return null;
  }

  await runQuery(
    `UPDATE resumes
     SET name = ?, job_title = ?, company_target = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      objResumeInput.name.trim(),
      objResumeInput.jobTitle.trim(),
      objResumeInput.companyTarget.trim(),
      intResumeId
    ]
  );

  await runQuery(
    `INSERT INTO resume_data (resume_id, json_data)
     VALUES (?, ?)
     ON CONFLICT(resume_id) DO UPDATE SET json_data = excluded.json_data`,
    [intResumeId, JSON.stringify(objResumeInput.resumeData)]
  );

  return getResumeById(intResumeId);
};

const deleteResume = async (intResumeId) => {
  const objDeleteResult = await runQuery("DELETE FROM resumes WHERE id = ?", [intResumeId]);
  return objDeleteResult.intChanges > 0;
};

module.exports = {
  createResume,
  deleteResume,
  getResumeById,
  listResumes,
  updateResume
};
