    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";

    export default function AuthPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        host: "",
        dbname: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
        const response = await fetch("http://localhost:3100/connection/connect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log("Response data:", data);

        if (data.success) {
            setMessage("Conexión exitosa. Redirigiendo...");
            setTimeout(() => {
            router.push("/dashboard");
            }, 1000);
        } else {
            setMessage(`❌ Error: ${data.message}`);
        }
        } catch (error) {
        console.error("Error connecting:", error);
        setMessage("Error conectando al servidor");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
            <h1 className="text-3xl font-bold">Bienvenido a la Aplicación de Base de Datos</h1>
            <p className="text-muted-foreground text-sm mt-2">
                Conéctate a tu instancia de SQL Server para continuar, recuerda que debes tener el servidor en ejecución y la base de datos creada

                El query de creacion se encuentra en la carpeta de backend, en la ruta:
                <code className="text-blue-500"> backend/src/db/dbquery.sql</code>
            </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                required
            />
            <input
                type="text"
                name="host"
                placeholder="Host"
                value={formData.host}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                required
            />
            <input
                type="text"
                name="dbname"
                placeholder="Database Name"
                value={formData.dbname}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                required
            />
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300"
            >
                Conectar
            </button>
            </form>

            {message && (
            <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
            )}
        </div>
        </div>
    );
    }
