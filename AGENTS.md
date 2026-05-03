## Coding Conventions
  - **Hungarian Notation**: Use Hungarian notation for variable naming
  - **camelCase**: Use camelCase when naming all variables
  - **Async Javascript**: Prefer to use async await rather than .then when performing asynchronous javascript functions
  - **No Build Tools**: Avoid build tools such as Babel, Webpack, or Vite unless it is explicitly required. Code must run either directly in the browser or via nodeJS
  - **Dependencies**: Do not add external libraries such as jQuery without approval. Prefer native Web APIs
  - **ECMAScript Version**: Target ES6+ features including arrow functions and template literals as well as promises
  - **External Libraries Local**: All external libraries that are included must not use a CDN but rather be included in project source files
  - **Bootstrap Utility Classes**: Use only standard Bootstrap 5+ utility classes for layout, spacing, and colors. Avoid creating custom CSS classes or inline styles unless the design cannot be achieved without them
  - **Comments**: Provide verbose comments to explain the flow of the code, and anything that would be difficult for a beginner developer to understand

## Accessibility
  - **Standards**: All user interfaces must meet WCAG 2.1+ accessibility standards
  - **Alt tags**: All images must also have an alt tag attribute that describes the image
  - **Preiority**: Prioritize accessibility over design
  - **ARIA Labels**: Include area labels on ALL HTML form controls

## Project Structure
  - **Entry Point**: All nodeJS applications must use server.js for an entry point
  - **API Routes**: All API routes must be included in the /api/ routing
  - **HTML Page**: The entire front end must be contained in a single HTML file named index.html.
  - **JavaScript and CSS**: Any JavaScript and CSS should be contained in respective files and directories and linked in index.html.
  - **Custom CSS**: Minimize the user of as much custom CSS as possible.
  - **LLM API**: Groq should be used for generating resume content from user input data.
  - **API Keys**: The Groq API key should be stored in .env.
  - **Ignore Files**: Use industry approach to ignoring files in .gitignore.
  

## API Requirements
  - **RESTful**: All API routes should be RESTful in design
  - **UPDATES**: All UPDATE routes should use PUT rather than PATCH
  - **DELETE**: DELETE routes should use URL parameters for primary key indicators
  - **SELECT**: All user inputs for SELECT should be passed biar URL query strings
  - **CREATE**: All user inputs for CREATES should be passed as JSON body data
  - **Input Validation**: All user-passed inputs should be validated
  - **SELECT RETURN**: All SELECT should return JSON arrays
  - **Status Codes**: Every route should return appropriate HTTP status codes for both success and error.

## DO Not
  - Do not hardcode credentials
  - Do not intermix user inputs in query, require prepared statements
  - Do not skip input validation

## Decision Guidelines
  - Prefer simpler, less complex and maintainable code
  - Ask for clarification if uncertain

## Testing
  - Ensure ALL GET API routes return JSON arrays
  - Handle any missing input data with proper error messaging
  - POST and PUT routes should validate all required fields

## AI Documentaion
  - Add prompts to the ai_documentation.md file in the same format as the planning stage promtps, but start the codex prompts from 1 and increment after each one.
  - After finishing work from a prompt send a summary of what changes were made from each prompt after all of the explaining you would normally do. Add these summaries below the prompts in the codex section of ai_documentation.md