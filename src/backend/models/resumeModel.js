const getEmptyResumeData = () => ({
  basics: {
    name: "",
    email: "",
    phone: "",
    location: ""
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
