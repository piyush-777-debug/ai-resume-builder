import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  // Fetch resumes
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/resume", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setResumes(res.data);
      } catch (err) {
        console.error("❌ Error fetching resumes:", err);
      }
    })();
  }, []);

  // Delete
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // Download (server-generated PDF)
  const handleDownload = async (resume) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/resume/download/${resume._id}`,
        {
          responseType: "blob",               // <-- important
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,              // support cookie auth too
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.name || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Download failed:", err);
    }
  };

  return (
    <div className="bg-emerald-50 min-h-screen w-screen p-5">
      <h2 className="text-center text-3xl font-bold mb-6">Your Resumes</h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate("/create-resume")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          + Create Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <p className="text-center text-2xl font-bold">
          No Resumes found. Create One
        </p>
      ) : (
        <ul className="space-y-4">
          {resumes.map((resume) => (
            <li
              key={resume._id}
              className="flex items-center justify-between bg-white shadow p-4 rounded-md"
            >
              <div className="max-w-[70%]">
                <strong className="text-lg">{resume.name}</strong>
                <p className="text-gray-600">
                  {resume.education?.[0]?.degree} — {resume.education?.[0]?.institution}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/resume/${resume._id}`)}
                  className="bg-yellow-400 rounded-md px-3 py-1 text-white hover:bg-yellow-500"
                >
                  View
                </button>

                <button
                  onClick={() => handleDownload(resume)}
                  className="bg-green-500 rounded-md px-3 py-1 text-white hover:bg-green-600"
                >
                  Download
                </button>

                <button
                  onClick={() => handleDelete(resume._id)}
                  className="bg-red-500 rounded-md px-3 py-1 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
