import sql from 'mssql';
import { getConnection } from "../config/conectionStore.js";

export const agregarMaquina = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(500).json({
            success: false,
            message: "No hay conexión activa con SQL Server.",
        });
    }

    try {
        const { estado, tipo, modelo, marca } = req.body;

        const result = await connection
            .request()
            .input("estado", sql.TinyInt, estado)
            .input("tipo", sql.NVarChar, tipo)
            .input("modelo", sql.NVarChar, modelo)
            .input("marca", sql.NVarChar, marca)
            .execute("agregar_maquina");

        return res.status(200).json({
            success: true,
            message: "Máquina agregada correctamente.",
        });
    } catch (error) {
        console.error("Error al agregar la máquina:", error);
        return res.status(500).json({
            success: false,
            message: "Error al agregar la máquina.",
        });
    }
}