const { validateResumeData } = require("./validationService");

const strGroqUrl = "https://api.groq.com/openai/v1/chat/completions";

const buildPrompt = (objResumeData) => (
  `You are a professional resume writer. Given structured resume data, rewrite and optimize it for clarity, impact, and ATS compatibility.

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
"projects": [...],
"certifications": [...]
}

Here is the input data: ${JSON.stringify(objResumeData)}`
);

const generateResume = async (objResumeData) => {
  const arrInputErrors = validateResumeData(objResumeData);

  if (arrInputErrors.length > 0) {
    const objError = new Error("Resume data is invalid.");
    objError.statusCode = 400;
    objError.details = arrInputErrors;
    throw objError;
  }

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "replace_with_your_groq_api_key") {
    const objError = new Error("GROQ_API_KEY is missing. Add it to the local .env file.");
    objError.statusCode = 503;
    throw objError;
  }

  const objGroqResponse = await fetch(strGroqUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You return only valid JSON and never invent resume facts."
        },
        {
          role: "user",
          content: buildPrompt(objResumeData)
        }
      ]
    })
  });

  if (!objGroqResponse.ok) {
    const strErrorText = await objGroqResponse.text();
    const objError = new Error(`Groq request failed with status ${objGroqResponse.status}.`);
    objError.statusCode = 502;
    objError.details = strErrorText;
    throw objError;
  }

  const objGroqJson = await objGroqResponse.json();
  const strContent = objGroqJson.choices?.[0]?.message?.content;

  if (!strContent) {
    const objError = new Error("Groq did not return resume content.");
    objError.statusCode = 502;
    throw objError;
  }

  try {
    const objFormattedResume = JSON.parse(strContent);
    const arrOutputErrors = validateResumeData({
      certifications: [],
      ...objFormattedResume
    });

    if (arrOutputErrors.length > 0) {
      const objError = new Error("Groq returned JSON that did not match the resume shape.");
      objError.statusCode = 502;
      objError.details = arrOutputErrors;
      throw objError;
    }

    return {
      certifications: [],
      ...objFormattedResume
    };
  } catch (objParseError) {
    if (objParseError.statusCode) {
      throw objParseError;
    }

    const objError = new Error("Groq returned invalid JSON.");
    objError.statusCode = 502;
    throw objError;
  }
};

module.exports = {
  generateResume
};
