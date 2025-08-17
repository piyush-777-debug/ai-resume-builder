import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: { email: "", phone: "", address: "", linkedin: "", github: "" },
    education: [{ degree: "", institution: "", year: "" }],
    experience: [{ role: "", company: "", year: "" }],
    skills: "",
    projects: "",
  });

  const navigate = useNavigate();

  // Contact field change
  const handleContactChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [e.target.name]: e.target.value },
    }));
  };

  // Simple field change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Array field change
  const handleArrayChange = (e, index, field, type) => {
    const newArr = [...formData[type]];
    newArr[index][field] = e.target.value;
    setFormData((prev) => ({ ...prev, [type]: newArr }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🛠️ Transform frontend formData into backend schema format
      const payload = {
        name: formData.name,
        contact: formData.contact,

        education: formData.education.map((edu) => ({
          degree: edu.degree,
          institute: edu.institution, // ✅ renamed
          startYear: edu.year,
          endYear: "",
          score: "",
        })),

        experiences: formData.experience.map((exp) => ({
          role: exp.role,
          company: exp.company,
          startDate: exp.year,
          endDate: "",
          description: "",
        })),

        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim())
          : [],

        projects: formData.projects
          ? [
              {
                title: formData.projects,
                link: "",
                description: "",
                tech: [],
              },
            ]
          : [],

        generatedText: "",
      };

      console.log("📤 Sending Payload:", payload);

      const res = await axios.post(
        "http://localhost:3000/api/resume/create",
        payload,
        { withCredentials: true }
      );

      console.log("✅ Resume Created:", res.data);
      navigate("/dashboard"); // ✅ Redirect after success (change route as per your app)
    } catch (error) {
      console.error("❌ Resume create error:", error.response?.data || error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Create Resume
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 overflow-y-auto max-h-[80vh] pr-2"
        >
          {/* Name */}
          <div>
            <label className="block font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="w-full border p-2 rounded mt-1"
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-700">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 rounded"
                onChange={handleContactChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="border p-2 rounded"
                onChange={handleContactChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="border p-2 rounded col-span-2"
                onChange={handleContactChange}
              />
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn"
                className="border p-2 rounded"
                onChange={handleContactChange}
              />
              <input
                type="text"
                name="github"
                placeholder="GitHub"
                className="border p-2 rounded"
                onChange={handleContactChange}
              />
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-700">Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Degree"
                className="border p-2 rounded"
                onChange={(e) =>
                  handleArrayChange(e, 0, "degree", "education")
                }
              />
              <input
                type="text"
                placeholder="Institution"
                className="border p-2 rounded"
                onChange={(e) =>
                  handleArrayChange(e, 0, "institution", "education")
                }
              />
              <input
                type="text"
                placeholder="Year"
                className="border p-2 rounded"
                onChange={(e) => handleArrayChange(e, 0, "year", "education")}
              />
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-700">Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Role"
                className="border p-2 rounded"
                onChange={(e) => handleArrayChange(e, 0, "role", "experience")}
              />
              <input
                type="text"
                placeholder="Company"
                className="border p-2 rounded"
                onChange={(e) =>
                  handleArrayChange(e, 0, "company", "experience")
                }
              />
              <input
                type="text"
                placeholder="Year"
                className="border p-2 rounded"
                onChange={(e) => handleArrayChange(e, 0, "year", "experience")}
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-700">Skills</h3>
            <textarea
              name="skills"
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-700">Projects</h3>
            <textarea
              name="projects"
              placeholder="e.g. Portfolio Website, Chat App"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Save Resume
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
