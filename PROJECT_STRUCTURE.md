# Resumint Project Structure

This document explains how the Resumint project is organized and what the main files do. It focuses mostly on the JavaScript files so the project is easier to maintain.

## Root Files

### `server.js`

This is the root application entry point.

When launched with Electron, it starts the local Express backend and opens a desktop `BrowserWindow` pointed at the local app URL. When launched with plain Node.js, it starts the same backend as a normal local web server.

### `package.json`

Defines the project metadata, npm scripts, and dependencies.

Important scripts:

- `npm start`: runs the Electron desktop app.
- `npm run dev`: runs the Electron desktop app.
- `npm run start:web`: runs the local Express server in a browser.

Main dependencies:

- `express`: web server and API routing.
- `sqlite3`: local SQLite database access.
- `dotenv`: loads `.env` configuration.
- `puppeteer`: renders resume HTML into PDF.
- `bootstrap`: local frontend styling library.
- `bootstrap-icons`: local icon font used for app buttons.
- `electron`: desktop application shell.

### `.env`

Stores local environment variables such as `PORT`, `GROQ_API_KEY`, and `GROQ_MODEL`.

This file should not be committed because it can contain private API keys.

### `.env.example`

Shows which environment variables the project expects, without storing real secrets.

### `.gitignore`

Tells git to ignore generated or private files, including `node_modules`, `.env`, database files, logs, and build output.

### `README.md`

Explains how to install, configure, and run the application.

### `ai_documentation.md`

Tracks the prompts and summaries required by the class project instructions.

## Data Folder

### `data/.gitkeep`

Keeps the `data` folder in the project even when there is no database file yet.

### `data/resumes.db`

This file is created automatically by the app after dependencies are installed and the server starts. It stores the local SQLite resume data.

## Backend JavaScript Files

### `src/backend/server.js`

Creates and starts the Express app.

Main responsibilities:

- Loads environment variables with `dotenv`.
- Initializes the SQLite database before accepting requests.
- Serves the frontend from `src/frontend`.
- Serves local Bootstrap files from `node_modules`.
- Serves local Bootstrap Icons files from `node_modules`.
- Mounts API routes under `/api`.
- Handles 404 and unexpected server errors.

This file should stay focused on app setup. Business logic belongs in services and controllers.

This file exports `startServer()` so the root Electron launcher can start the backend before opening the desktop window.

### `src/backend/db/database.js`

Manages the SQLite database connection.

Main responsibilities:

- Creates the `data` folder if it does not exist.
- Opens `data/resumes.db`.
- Enables SQLite foreign key support.
- Runs `schema.sql` to create tables.
- Provides promise-based helper functions:
  - `runQuery`
  - `getQuery`
  - `allQuery`

Most backend files should use these helpers instead of directly using `sqlite3`.

### `src/backend/models/resumeModel.js`

Contains the default empty resume data structure.

This keeps the expected resume JSON shape in one easy-to-find place.

### `src/backend/routes/resumeRoutes.js`

Defines REST routes for resume management.

Routes:

- `GET /api/resumes`
- `POST /api/resumes`
- `GET /api/resumes/:id`
- `PUT /api/resumes/:id`
- `DELETE /api/resumes/:id`

This file only connects URLs to controller functions. It should not contain database logic.

### `src/backend/routes/generationRoutes.js`

Defines the route for Groq resume generation.

Route:

- `POST /api/generate`

### `src/backend/routes/exportRoutes.js`

Defines the route for PDF export.

Route:

- `POST /api/export/pdf`

### `src/backend/controllers/resumeController.js`

Handles HTTP request and response details for resume CRUD.

Main responsibilities:

- Reads route parameters and query strings.
- Validates resume ids.
- Validates request body data before saving.
- Calls `resumeService`.
- Sends correct HTTP status codes and JSON responses.

This file does not directly talk to SQLite. That keeps the API layer easier to maintain.

### `src/backend/controllers/generationController.js`

Handles the `/api/generate` request.

Main responsibilities:

- Reads `resumeData` from the JSON body.
- Validates the resume data.
- Calls `llmService.generateResume`.
- Returns polished resume JSON or a useful error.

### `src/backend/controllers/exportController.js`

Handles PDF export requests.

Main responsibilities:

- Reads `resumeData` from the JSON body.
- Validates the resume data.
- Calls `pdfService.createPdfBuffer`.
- Sends the PDF response with `Content-Type: application/pdf`.

### `src/backend/services/resumeService.js`

Contains the database logic for resumes.

Main responsibilities:

- Lists saved resumes.
- Gets a single resume by id.
- Creates a resume and its JSON data.
- Updates a resume and its JSON data.
- Deletes a resume.
- Converts database row names like `job_title` into JavaScript names like `jobTitle`.

This is the main file to edit if resume storage behavior needs to change.

### `src/backend/services/validationService.js`

Validates user-provided resume data before the app saves it, sends it to Groq, or exports it as a PDF.

Main responsibilities:

- Checks that resume data has the expected object and array structure.
- Checks required fields for the resume save payload.
- Returns readable validation error messages.

This file is important because user input should not be trusted without validation.

### `src/backend/services/llmService.js`

Handles Groq API integration.

Main responsibilities:

- Builds the resume-writing prompt.
- Sends the structured resume JSON to Groq.
- Requests strict JSON output.
- Parses and validates the returned JSON.
- Reports clear errors when the API key is missing or Groq returns invalid data.

This is the file to edit if the prompt, model, or Groq settings need to change.

### `src/backend/services/pdfService.js`

Converts structured resume data into a PDF.

Main responsibilities:

- Reads the HTML and CSS resume template files.
- Escapes user-provided text so it is safe to inject into HTML.
- Renders non-empty education, experience, projects, skills, and certifications.
- Uses Puppeteer to convert the generated HTML into a PDF.
- Returns the PDF as a Node `Buffer` so Express sends it as a real binary file.

This is the file to edit if the PDF layout or rendering behavior needs to change.

## Frontend Files

### `src/frontend/index.html`

The single-page frontend required by the project instructions.

Main responsibilities:

- Defines the visible application layout.
- Provides the sidebar resume list.
- Provides the tabbed resume editor form.
- Includes accessible labels, fieldsets, legends, ARIA attributes, and live status regions.
- Links local Bootstrap CSS and local app files.

### `src/frontend/scripts/app.js`

Controls the browser-side application behavior.

Main responsibilities:

- Tracks the current resume being edited.
- Adds and removes education, experience, and project form sections.
- Collects form fields into structured resume JSON.
- Saves resumes through the backend API.
- Loads, searches, and deletes saved resumes.
- Sends resume data to Groq through `/api/generate`.
- Builds and opens the in-app resume preview dialog.
- Requests PDF export through `/api/export/pdf`.
- Updates visible status messages for accessibility.

This is the main file to edit when changing frontend behavior.

### `src/frontend/styles/app.css`

Contains the small amount of custom CSS used by the frontend.

Most layout and color styling is done with Bootstrap utility classes in `index.html`, as required by the project instructions.

## Template Files

### `src/templates/resumeTemplate.html`

Defines the HTML structure used for exported PDF resumes.

The placeholders such as `{{name}}`, `{{contact}}`, and `{{sections}}` are replaced by `pdfService.js`.

### `src/templates/resumeTemplate.css`

Defines the PDF resume styling.

This CSS is separate from the main frontend CSS because the PDF layout has different needs than the web application UI.

It also controls the spacing between the main resume content and the date column, plus the multi-column skills layout used when many skills are listed.

## Request Flow Examples

### Saving a Resume

1. The user clicks `Save Resume`.
2. `src/frontend/scripts/app.js` collects form data.
3. The frontend sends JSON to `POST /api/resumes` or `PUT /api/resumes/:id`.
4. `resumeRoutes.js` sends the request to `resumeController.js`.
5. `resumeController.js` validates the request.
6. `resumeService.js` saves the data with prepared SQLite statements.
7. The frontend refreshes the saved resume list.

### Generating Resume Content

1. The user clicks `Generate Resume`.
2. `app.js` sends structured resume data to `POST /api/generate`.
3. `generationController.js` validates the input.
4. `llmService.js` sends the data to Groq.
5. Groq returns polished JSON.
6. The frontend loads the polished JSON back into the form for review.

### Exporting a PDF

1. The user clicks `Export PDF`.
2. `app.js` sends structured resume data to `POST /api/export/pdf`.
3. `exportController.js` validates the input.
4. `pdfService.js` injects resume data into the HTML template.
5. Puppeteer renders the HTML into PDF bytes.
6. `pdfService.js` converts the bytes into a Node `Buffer`.
7. Express sends the PDF file to the browser for download.

Empty sections are skipped during this process, so the PDF does not show headings for sections with no data.
