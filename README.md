# Resumint

Resumint is a locally hosted resume builder built with Node.js, Express, SQLite, vanilla JavaScript, Bootstrap, Groq, and Puppeteer. It is structured so the backend can later be launched as a local process from an ElectronJS desktop app.

## Setup

1. Install Node.js with npm.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` if needed and add your Groq API key:

```bash
GROQ_API_KEY=your_key_here
```

4. Start the local server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000).

## Features

- Create, edit, save, load, search, and delete multiple resumes.
- Store resume metadata and structured JSON locally in `data/resumes.db`.
- Generate polished resume JSON through the Groq OpenAI-compatible API.
- Export the current structured resume as a local PDF using Puppeteer.
- Use semantic HTML, labeled controls, ARIA live regions, keyboard-friendly tabs, and high-contrast Bootstrap styling.

## API Routes

- `GET /api/resumes?search=value` returns a JSON array of saved resumes.
- `POST /api/resumes` creates a resume from JSON body data.
- `GET /api/resumes/:id` returns a JSON array containing one resume.
- `PUT /api/resumes/:id` updates a resume from JSON body data.
- `DELETE /api/resumes/:id` deletes a resume by URL parameter.
- `POST /api/generate` sends structured resume JSON to Groq and returns polished JSON.
- `POST /api/export/pdf` returns a generated PDF file.

## Resume JSON Shape

```json
{
  "basics": {
    "name": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "education": [],
  "experience": [],
  "projects": [],
  "skills": [],
  "certifications": []
}
```

## Electron Migration Notes

- The root `server.js` is the launch entry point.
- No absolute project paths are required at runtime; paths are resolved from module locations.
- Frontend files are served from `src/frontend` and can later be loaded in a `BrowserWindow`.
- Data remains local in the `data` directory.
