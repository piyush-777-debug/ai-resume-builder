
const generateWithAI = require("../utils/ai");

const generateCoverLetter = async (req, res) => {
  try {
    const { name, jobTitle, company, skills, experiences } = req.body;

    if (!name || !jobTitle || !company || !skills || !experiences) {
      return res.status(400).json({
        message: "All fields (name, jobTitle, company, skills, experiences) are required"
      });
    }

    const prompt = `
      Write a professional cover letter for a candidate applying to ${company} as a ${jobTitle}.
      Candidate details:
      - Name: ${name}
      - Skills: ${skills.join(", ")}
      - Experiences: ${experiences.join(", ")}
      
      The tone should be formal, concise, and highlight why the candidate is a great fit.
    `;

    const aiText = await generateWithAI(prompt);

    res.status(200).json({
      message: "Cover letter generated successfully",
      coverLetter: aiText
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { generateCoverLetter };
