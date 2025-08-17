const resumeModel = require('../models/Resume')
const axios = require('axios');
const PDFDocument = require("pdfkit");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env file");
}

const createResume = async (req, res) => {
    try {
      const { name, contact, education, experiences, skills, projects } = req.body;
  
      if (!name || !contact || !education || !experiences || !skills || !projects) {
        return res.status(400).json({
          message: "All required fields must be filled"
        });
      }
  
      let skillsArray = [];
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string") {
        skillsArray = skills.split(",").map(s => s.trim());
      } else {
        return res.status(400).json({ message: "Skills must be an array or a comma-separated string" });
      }
  
      const prompt = `
        Generate a professional resume in well-structured plain text format.
        Use sections like:

        Name: ${name}

        Contact:
        - Email: ${contact.email}
        - Phone: ${contact.phone || ""}
        - Address: ${contact.address || ""}
        - LinkedIn: ${contact.linkedin || ""}
        - GitHub: ${contact.github || ""}

        Education:
        ${education.map(e => `- ${e.degree} at ${e.institute} (${e.startYear} - ${e.endYear}), Score: ${e.score}`).join("\n")}

        Experience:
        ${experiences.map(exp => `- ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n  ${exp.description}`).join("\n")}

        Projects:
        ${projects.map(p => `- ${p.title} (${p.link || "N/A"})\n  ${p.description}\n  Tech: ${p.tech?.join(", ")}`).join("\n")}

        Skills: ${skillsArray.join(", ")}

        Format it neatly and make it look like a professional resume.
            `;

  
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      const generatedResume = response.data.candidates[0].content.parts[0].text;
  
      const newResume = new resumeModel({
        user: req.user.id,
        name,
        education,
        contact,
        skills: skillsArray, // ✅ always array
        experiences,
        projects,
        generatedText: generatedResume
      });
  
      await newResume.save();
  
      res.status(201).json({
        message: "Resume created successfully",
        resume: newResume
      });
    } catch (error) {
      console.error("❌ Error creating resume:", error.response?.data || error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// Get all resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await resumeModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error("Error showing resume:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get resume by ID
const getResumesById = async (req, res) => {
  try {
    const resume = await resumeModel.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume Not Found" });
    }

    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Resume
const DeleteResume = async (req, res) => {
  try {
    const resume = await resumeModel.findById(req.params.id);

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await resume.deleteOne();
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const DownloadResume = async (req, res) => {
    try {
      const resume = await resumeModel.findById(req.params.id);
  
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
  
      if (resume.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
      }
  
      const doc = new PDFDocument();
      res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
      res.setHeader("Content-Type", "application/pdf");
  
      doc.pipe(res);
  
      doc.fontSize(20).text(resume.name, { align: "center" });
      doc.moveDown();
  
      doc.fontSize(14).text("Contact Info:");
      doc.text(`Email: ${resume.contact.email}`);
      if (resume.contact.phone) doc.text(`Phone: ${resume.contact.phone}`);
      if (resume.contact.linkedin) doc.text(`LinkedIn: ${resume.contact.linkedin}`);
      if (resume.contact.github) doc.text(`GitHub: ${resume.contact.github}`);
      doc.moveDown();
  
      doc.fontSize(14).text("Education:");
      resume.education.forEach(e => {
        doc.text(`${e.degree} at ${e.institute} (${e.startYear} - ${e.endYear})`);
      });
      doc.moveDown();
  
      doc.fontSize(14).text("Experience:");
      resume.experiences.forEach(exp => {
        doc.text(`${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate})`);
        doc.text(`  ${exp.description}`);
      });
      doc.moveDown();
  
      doc.fontSize(14).text("Projects:");
      resume.projects.forEach(p => {
        doc.text(`${p.title} (${p.link || "N/A"})`);
        doc.text(`  ${p.description}`);
        doc.text(`  Tech: ${p.tech?.join(", ")}`);
      });
      doc.moveDown();
  
      doc.fontSize(14).text("Skills:");
      doc.text(resume.skills.join(", "));
  
      doc.end();
    } catch (error) {
      console.error("❌ Error downloading resume:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = { getResumes, createResume, DeleteResume, getResumesById, DownloadResume };
