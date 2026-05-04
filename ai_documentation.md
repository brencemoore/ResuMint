## AI Usage Statement

This document shows the entire usage of AI throughout the development of this project. Included are prompts that were used for asking ChatGPT on guidance and prompting for the development to start in codex. All prompts besides prompt #1 in Codex were hand written by Brence Moore. The AGENTS.md file was altered from the file we made in class in CSC 3100 about agentic coding. No AI was used in editing that file. 

## Prompts for Planning Stage

The following prompts were used to find an alternative to using Gemini's API because I was never able to create an API token due to age verification, and none of the options could become resolved.

**Prompt 1:**
```
Is there a free LLM api or open souce model that i can use in a wedb app to take in string data and format a resume? Would it make sense to have the llm format the resume into the pdf, or have a seperate tool for that?
```

**Prompt 2:**
```
would a locally hosted model be easy enough to run on many devices?
```

**Prompt 3:**
```
what are the best Free APIs to use that are not Gemini?
```

Prompt 4 was the prompt used to generate the prompt for codex initializing the project.
**Prompt 4:**
```
I need you to generate a more detailed prompt according to these specifications for my resume builder web application. The application should be able to run locally on the user's computer. Accessibility is the most important part about this application, but it needs to look nice. The app does not need to look over the top and the code needs to be maintainable. The application needs to use node.js and be able to implement ElectronJS later after functional development is completed. I also need a unique name that is easy to remember and fits the application. The structure of the project needs to be efficient and maintainable. All libraries used must be stored locally instead of CDNs being used. Resumes are tailored to specific jobs, so I need a way to store different resumes and the user be able to save and load different ones. When it comes to editing or creating the resume, the web app needs to have easy to access and use areas to enter in data for related areas that are important for resumes. For the formatting, you will use Groq api to add the user data for a specific resume and combine it into a single prompt to output the resume data. The outputted data should be in a format that is easy to use with a free library or tool that can format the resume content into a pdf. Choose the best option for storing the user data such as sqlite in a .db file. 
Make the prompt as detailed as you can for a codex prompt to build this project. If you believe there are any parts that are missing, please fill them in or ask clarifying questions before outputting the final prompt.
```

## Prompts in Codex

The following prompts were used in my codex environment to develop the resume builder web application.

**Prompt 1:**
```
Build a locally hosted resume builder web application using Node.js with a strong emphasis on accessibility, maintainability, and clean architecture. The application should be designed in a way that allows easy migration into an ElectronJS desktop app after initial development.

---

# 🧠 PROJECT OVERVIEW

Create a resume builder application named **"Resumint"** (Resume + Mint → fresh, clean, memorable).

The application should:

* Run locally on a user's machine
* Allow users to create, edit, save, and load multiple resumes
* Use a structured form-based UI for entering resume data
* Use the Groq API to transform structured user input into a polished resume
* Output structured data that can be converted into a PDF using a local rendering tool
* Store all data locally using SQLite
* Use only locally installed libraries (no CDN usage)

---

# 🏗️ TECH STACK

## Backend

* Node.js
* Express.js
* SQLite (via better-sqlite3 or sqlite3)
* dotenv for environment variables

## Frontend

* Vanilla JS OR minimal framework (prefer lightweight: Alpine.js or plain JS)
* HTML5 + CSS3
* Optional: Tailwind (installed locally, NOT CDN)

## PDF Generation

* Puppeteer (preferred)
OR
* HTML → PDF renderer (must be local, no external services)

## LLM Integration

* Groq API (OpenAI-compatible interface)

---

# 📁 PROJECT STRUCTURE

Use a clean, modular structure:

/resumint
├── /src
│   ├── /backend
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── llmService.js
│   │   │   ├── resumeService.js
│   │   ├── db/
│   │   │   ├── database.js
│   │   │   ├── schema.sql
│   │   ├── models/
│   │
│   ├── /frontend
│   │   ├── index.html
│   │   ├── /styles
│   │   ├── /scripts
│   │   ├── /components
│   │
│   ├── /templates
│   │   ├── resumeTemplate.html
│
├── /data
│   ├── resumes.db
│
├── package.json
├── .env
├── README.md

---

# 🗄️ DATABASE DESIGN (SQLite)

Create a SQLite database stored locally at:

/data/resumes.db

## Tables:

### resumes

* id (primary key)
* name (string) → user-defined resume name
* job_title (string)
* company_target (string)
* created_at
* updated_at

### resume_data

* id
* resume_id (foreign key)
* json_data (TEXT) → full structured resume data

---

# 🧾 RESUME DATA STRUCTURE (IMPORTANT)

Store resume data as JSON:

{
"basics": {
"name": "",
"email": "",
"phone": "",
"location": ""
},
"education": [
{
"school": "",
"degree": "",
"start": "",
"end": ""
}
],
"experience": [
{
"company": "",
"role": "",
"start": "",
"end": "",
"bullets": []
}
],
"projects": [],
"skills": [],
"certifications": []
}

---

# 🎨 FRONTEND REQUIREMENTS

## Accessibility (TOP PRIORITY)

* All inputs must have labels
* Use semantic HTML (section, form, fieldset)
* Keyboard navigable
* ARIA attributes where needed
* High contrast design
* No reliance on color alone

## UI Layout

* Sidebar:

* Resume list (load/save/delete)
* Main panel:

* Tabbed sections:

    * Basics
    * Education
    * Experience
    * Projects
    * Skills
* Buttons:

* Save Resume
* Generate Resume
* Export PDF

## UX Requirements

* Dynamic add/remove sections (e.g. add experience)
* Autosave optional
* Simple, clean design (not flashy)

---

# 🔁 BACKEND FUNCTIONALITY

## API Endpoints

### Resume Management

* GET /resumes
* POST /resumes
* GET /resumes/:id
* PUT /resumes/:id
* DELETE /resumes/:id

### LLM Processing

* POST /generate

* Input: structured JSON resume
* Output: formatted resume JSON

---

# 🤖 GROQ API INTEGRATION

Create a service:

/services/llmService.js

## Behavior:

* Accept structured resume JSON
* Convert into a prompt
* Call Groq API
* Return structured output

## Prompt Design (VERY IMPORTANT)

The LLM must:

* NOT hallucinate
* ONLY reformat/improve content
* Output strict JSON

### Prompt Template:

"You are a professional resume writer. Given structured resume data, rewrite and optimize it for clarity, impact, and ATS compatibility.

Rules:

* Do NOT add fake experience
* Improve bullet points using action verbs
* Keep concise and professional tone
* Output ONLY valid JSON
* Do NOT include explanations

Return format:

{
"basics": {...},
"experience": [...],
"education": [...],
"skills": [...],
"projects": [...]
}

Here is the input data: <INSERT USER JSON HERE>"

---

# 📄 PDF GENERATION

## Flow:

1. LLM returns structured JSON
2. Inject into HTML template
3. Render HTML → PDF using Puppeteer

## Template:

* Clean, minimal resume layout
* Use CSS for spacing/typography
* No inline styles (maintainable)

---

# 💾 LOCAL STORAGE STRATEGY

* SQLite for structured data
* No cloud dependencies
* All libraries installed via npm (no CDN)

---

# ⚙️ ELECTRON COMPATIBILITY

Ensure:

* No absolute paths
* Use relative file handling
* Backend can run as local process
* Frontend can be loaded via Electron BrowserWindow

---

# 🧪 DEVELOPMENT CONSIDERATIONS

* Modular code (services, controllers)
* Avoid monolithic files
* Clear separation of concerns
* Environment config via .env

---

# 🚀 OPTIONAL FEATURES (IF TIME)

* Resume templates (multiple styles)
* Keyword optimization for job descriptions
* Import/export JSON resumes
* Version history

---

# 📌 FINAL NOTES

* Prioritize readability over cleverness
* Avoid unnecessary dependencies
* Keep architecture simple but scalable
* Ensure all features work offline after install

---

Generate the full implementation step-by-step, starting with:

1. Project setup
2. Backend API
3. Database
4. Frontend UI
5. LLM integration
6. PDF generation

Ensure each step builds on the previous one and results in a working application.
```

**Prompt 2:**
```
There is something incorrect with exporting the resumes as a pdf. Can you reverify that this works, or show me the file that needs to be changed. Also create a new .md file in the root directory that explains the structure of the project, and what each file does, mainly the .js files so that I can maintain this on my own.
```

**Prompt 3:**
```
Add the icon located in the images folder to the top left of the header on the front end page. Also in server.js change the application to run with electron js as a application. If there is a way to add a preview of the resume from a button in the same area as "Save Resume", "Generate Resume", and Export PDF. Name this new button "Preview Resume" and change the "Generate Resume" button to say something short along the lines of AI Enhance or Enhance Resume. Also add code in the index.html file for me to input icons from bootstrap icons, but if you think you can find icons that are fitting for each button, add them yourself. When you finish all of this tell me which changes you made, and tell me if I need to still add icons to which parts.
```

**Prompt 4:**
```
Have the resume output be structured more clearly and do no include sections in the pdf if they are empty. Skills are hard to read when there are a lot. Each sections has issues with text wrapping, so change it to where it will leave white space between the two "parts" of the resume between the content and dates. Also in the basic data add asection to add a github and linked in.
```


## Codex Prompt Summaries

**Prompt 1 Summary:**
  - Created the Resumint project structure with a root `server.js`, backend modules, frontend files, templates, and local data directory.
  - Added Express API routes under `/api` for resume CRUD, Groq-powered resume generation, and Puppeteer PDF export.
  - Added SQLite schema and database helpers for local resume storage using prepared statements.
  - Built a single-page accessible Bootstrap frontend with labeled form controls, tabs, dynamic education/experience/project sections, save/load/delete/search actions, Groq generation, and PDF export.
  - Added environment configuration files, `.gitignore`, package metadata, and README setup documentation.
  - Removed an exposed API key string from this documentation file so credentials belong only in the ignored local `.env` file.


**Prompt 2 Summary:**
  - Reviewed the PDF export flow and fixed the likely binary response problem by converting Puppeteer's PDF bytes to a Node `Buffer` in `src/backend/services/pdfService.js`.
  - Updated the frontend PDF download cleanup in `src/frontend/scripts/app.js` so the temporary browser URL is revoked after the download has time to start.
  - Added `PROJECT_STRUCTURE.md` in the root directory to explain the project layout, JavaScript file responsibilities, and major request flows.


**Prompt 3 Summary:**
  - Added the Resumint app icon from `src/frontend/images` to the top-left header area.
  - Added Bootstrap Icons support through locally served files and selected icons for the main action buttons, sidebar actions, add buttons, delete buttons, and preview close button.
  - Changed the main action button text from `Generate Resume` to `AI Enhance`.
  - Added a `Preview Resume` button and accessible preview dialog that renders the current form data in a resume-style layout.
  - Refactored startup so the root `server.js` can launch the app as an Electron desktop application while still supporting browser-only local server mode.
  - Updated README and project structure documentation for the Electron and preview changes.


**Prompt 4 Summary:**
  - Added GitHub and LinkedIn fields to the Basics form and saved resume JSON.
  - Updated validation and the Groq prompt shape so profile links can be included without breaking older saved resumes.
  - Changed PDF rendering so empty sections are not included in exported resumes.
  - Improved PDF and preview layout with a clearer content/date grid that leaves whitespace between the main content and date column.
  - Changed skills rendering in both PDF and preview to a multi-column layout so long skill lists are easier to scan.
