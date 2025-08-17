import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/api/resume/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResume(res.data);
      } catch (err) {
        console.error("❌ Error fetching resume:", err);
      }
    };
    fetchResume();
  }, [id]);

  if (!resume) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{resume.name}</h1>
      
      <h2 className="text-xl font-semibold">Contact</h2>
      <p>Email: {resume.contact.email}</p>
      <p>Phone: {resume.contact.phone}</p>
      <p>LinkedIn: {resume.contact.linkedin}</p>

      <h2 className="text-xl font-semibold mt-4">Education</h2>
      {resume.education.map((edu, i) => (
        <div key={i}>
          <p>{edu.degree} — {edu.institute} ({edu.startYear} - {edu.endYear})</p>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-4">Experience</h2>
      {resume.experiences.map((exp, i) => (
        <div key={i}>
          <p>{exp.role} @ {exp.company} ({exp.startDate} - {exp.endDate})</p>
          <p>{exp.description}</p>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-4">Skills</h2>
      <ul className="list-disc list-inside">
        {resume.skills.map((skill, i) => <li key={i}>{skill}</li>)}
      </ul>
    </div>
  );
};

export default ResumeDetail;
