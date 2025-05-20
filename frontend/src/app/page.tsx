"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  useEffect(() => {
    localStorage.removeItem("sqlConnection");
  }, []);

  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    host: "",
    dbname: ""
  });

  const [message, setMessage] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("sqlConnection");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3100/connection/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("sqlConnection", JSON.stringify(formData));
        setMessage(data.message);
        setTimeout(() => router.push("/vista_clientes"), 1000);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Error connecting:", err);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold mb-4">Conectar a SQL Server</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="border p-2 rounded" required />
        <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className="border p-2 rounded" required />
        <input name="host" placeholder="Host" value={formData.host} onChange={handleChange} className="border p-2 rounded" required />
        <input name="dbname" placeholder="Database Name" value={formData.dbname} onChange={handleChange} className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Conectar</button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
