const getEmptyResumeData = () => ({
  basics: {
    name: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: ""
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: []
});

module.exports = {
  getEmptyResumeData
};
