const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const resumeRoutes = require("./routes/resumeRoutes");
const generationRoutes = require("./routes/generationRoutes");
const exportRoutes = require("./routes/exportRoutes");
const { initializeDatabase } = require("./db/database");

dotenv.config();

const objApp = express();
const intPort = Number.parseInt(process.env.PORT || "3000", 10);
const strProjectRoot = path.resolve(__dirname, "../..");
const strFrontendPath = path.join(strProjectRoot, "src", "frontend");
const strBootstrapPath = path.join(strProjectRoot, "node_modules", "bootstrap", "dist");
const strBootstrapIconsPath = path.join(strProjectRoot, "node_modules", "bootstrap-icons", "font");

// Express receives JSON from the browser forms and converts it into JavaScript objects.
// The size limit keeps accidental huge requests from consuming too much local memory.
objApp.use(express.json({ limit: "1mb" }));

// Bootstrap is served from local node_modules so the app works without any CDN access.
objApp.use("/vendor/bootstrap", express.static(strBootstrapPath));
objApp.use("/vendor/bootstrap-icons", express.static(strBootstrapIconsPath));
objApp.use(express.static(strFrontendPath));

// All application APIs live under /api to keep browser pages and backend routes separated.
objApp.use("/api/resumes", resumeRoutes);
objApp.use("/api/generate", generationRoutes);
objApp.use("/api/export", exportRoutes);

objApp.get("/", (objRequest, objResponse) => {
  objResponse.sendFile(path.join(strFrontendPath, "index.html"));
});

objApp.use((objRequest, objResponse) => {
  objResponse.status(404).json({ error: "The requested resource was not found." });
});

objApp.use((objError, objRequest, objResponse, objNext) => {
  console.error(objError);
  objResponse.status(500).json({ error: "An unexpected server error occurred." });
});

const startServer = async () => {
  await initializeDatabase();

  return new Promise((resolve) => {
    const objServer = objApp.listen(intPort, () => {
      const intActivePort = objServer.address().port;

      console.log(`Resumint is running at http://localhost:${intActivePort}`);
      resolve({
        intPort: intActivePort,
        objServer
      });
    });
  });
};

if (require.main === module) {
  startServer().catch((objError) => {
    console.error("Failed to start Resumint.", objError);
    process.exit(1);
  });
}

module.exports = {
  objApp,
  startServer
};
