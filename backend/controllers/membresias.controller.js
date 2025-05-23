import sql from 'mssql';
import { getConnection } from "../config/conectionStore.js";

export const renovar_membresia = async (req, res) => {
    const {connection} = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    const {cedula,nueva_fecha} = req.body;

    if (!cedula || !nueva_fecha) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios"
        });
    }

    try {
        await connection
            .request()
            .input("cedula", sql.Char(9), cedula)
            .input("nueva_fecha", sql.Date, nueva_fecha)
            .execute("renovar_membresia");

        res.status(200).json({
            success: true,
            message: "Membresía renovada correctamente"
        });
    } catch (err) {
        console.error("Error executing renovar_membresia procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}


export const clientesMembresiaVencida = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active Sql server connection"
        });
    }

    try {
        const result = await connection
            .request()
            .query(`
                    SELECT 
                        p.cedula,
                        p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS nombre_completo,
                        m.fecha_expiracion,
                        DATEDIFF(DAY, m.fecha_expiracion, GETDATE()) AS dias_vencida
                    FROM cliente_membresias cm
                    JOIN membresia m ON cm.id_membresia = m.id_membresia
                    JOIN persona p ON cm.cedula = p.cedula
                    WHERE m.fecha_expiracion < GETDATE();
                `);
        console.log(result);
        res.json({
            success: true,
            tables: [result.recordset]
        });
    } catch (err) {
        console.error("Error executing consulta_avanzada1 procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}