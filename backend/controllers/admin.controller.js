import { getConnection } from "../config/conectionStore.js";

export const vistaAdminMaquina = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(500).json({
            success: false,
            message: "No hay conexión activa con SQL Server.",
        });
    }

    try {
        const result = await connection
            .request()
            .query("SELECT * FROM vista_admin_maquina");

        return res.status(200).json({
            success: true,
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error al obtener las máquinas:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener las máquinas.",
        });
    }
}