const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const strProjectRoot = path.resolve(__dirname, "../../..");
const strDataDirectory = path.join(strProjectRoot, "data");
const strDatabasePath = path.join(strDataDirectory, "resumes.db");
const strSchemaPath = path.join(__dirname, "schema.sql");

let objDatabase;

const initializeDatabase = () => {
  if (!fs.existsSync(strDataDirectory)) {
    fs.mkdirSync(strDataDirectory, { recursive: true });
  }

  objDatabase = new sqlite3.Database(strDatabasePath);
  const strSchemaSql = fs.readFileSync(strSchemaPath, "utf8");

  // SQLite setup runs in serialize mode so foreign keys are enabled before the
  // schema is created. Returning a promise lets server startup wait for this work.
  return new Promise((resolve, reject) => {
    objDatabase.serialize(() => {
      objDatabase.run("PRAGMA foreign_keys = ON", (objPragmaError) => {
        if (objPragmaError) {
          reject(objPragmaError);
          return;
        }

        objDatabase.exec(strSchemaSql, (objSchemaError) => {
          if (objSchemaError) {
            reject(objSchemaError);
            return;
          }

          resolve();
        });
      });
    });
  });
};

const getDatabase = () => {
  if (!objDatabase) {
    throw new Error("Database has not been initialized.");
  }

  return objDatabase;
};

const runQuery = (strSql, arrParameters = []) => {
  const objDb = getDatabase();

  return new Promise((resolve, reject) => {
    objDb.run(strSql, arrParameters, function (objError) {
      if (objError) {
        reject(objError);
        return;
      }

      resolve({ intLastId: this.lastID, intChanges: this.changes });
    });
  });
};

const getQuery = (strSql, arrParameters = []) => {
  const objDb = getDatabase();

  return new Promise((resolve, reject) => {
    objDb.get(strSql, arrParameters, (objError, objRow) => {
      if (objError) {
        reject(objError);
        return;
      }

      resolve(objRow);
    });
  });
};

const allQuery = (strSql, arrParameters = []) => {
  const objDb = getDatabase();

  return new Promise((resolve, reject) => {
    objDb.all(strSql, arrParameters, (objError, arrRows) => {
      if (objError) {
        reject(objError);
        return;
      }

      resolve(arrRows);
    });
  });
};

module.exports = {
  allQuery,
  getQuery,
  initializeDatabase,
  runQuery
};
