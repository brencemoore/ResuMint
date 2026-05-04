// The root server.js file is the app entry point. When launched with Electron,
// it starts the local Express backend and opens the desktop window. When launched
// with plain Node.js, it still starts the same local web server for development.
const path = require("path");
const { startServer } = require("./src/backend/server");

let objMainWindow = null;
let objRunningServer = null;

const createElectronWindow = async (intPort) => {
  const { BrowserWindow } = require("electron");
  const strIconPath = path.join(__dirname, "src", "frontend", "images", "android-chrome-512x512.png");

  objMainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 960,
    minHeight: 680,
    icon: strIconPath,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await objMainWindow.loadURL(`http://localhost:${intPort}`);

  objMainWindow.on("closed", () => {
    objMainWindow = null;
  });
};

const startElectronApp = async () => {
  const { app } = require("electron");

  await app.whenReady();

  const objServerResult = await startServer();
  objRunningServer = objServerResult.objServer;
  await createElectronWindow(objServerResult.intPort);

  app.on("activate", async () => {
    if (!objMainWindow) {
      await createElectronWindow(objServerResult.intPort);
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("before-quit", () => {
    if (objRunningServer) {
      objRunningServer.close();
    }
  });
};

if (process.versions.electron) {
  startElectronApp().catch((objError) => {
    console.error("Failed to start Resumint Electron app.", objError);
    process.exit(1);
  });
} else {
  startServer().catch((objError) => {
    console.error("Failed to start Resumint web server.", objError);
    process.exit(1);
  });
}
