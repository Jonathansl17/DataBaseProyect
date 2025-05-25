import sql from "mssql";
import { getConnection } from "../config/conectionStore.js";

export const crearSesion = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(500).json({
            success: false,
            message: "No hay conexión activa con SQL Server.",
        });
    }

    const { id_sesion, fecha } = req.body;

    if (!id_sesion || !fecha) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios.",
        });
    }

    try {
        await connection
            .request()
            .input("id_sesion", sql.Int, id_sesion)
            .input("fecha", sql.Date, fecha)
            .execute("crear_sesion_programada");

        res.json({
            success: true,
            message: "Sesión creada exitosamente",
        });
    } catch (err) {
        console.error("Error al crear la sesión: ", err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}



export const inscribirClienteASesion = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active Sql server connection"
        });
    }

    const { cedula_cliente, id_sesion_programada } = req.body;

    if (!cedula_cliente || !id_sesion_programada) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son obligatorios"
        });
    }

    try {
        await connection
            .request()
            .input("cedula", sql.Char(9), cedula_cliente)
            .input("id_sesion_programada", sql.Int, id_sesion_programada)
            .execute("inscribir_cliente_a_sesion_programada");

        res.json({
            success: true,
            message: "Cliente inscrito a la sesión correctamente"
        });
    } catch (err) {
        console.error("Error executing iinscribir_cliente_a_sesion_programada procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const vistaDetallesSesion = async (req, res) => {
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
            .query(`SELECT * FROM vista_detalles_sesion;`);
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



export const cantidadSesionPorFecha = async (req, res) => {
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
                        c.nombre AS clase,
                        sp.fecha AS fecha_sesion,
                        COUNT(*) AS total_sesiones_en_fecha
                    FROM sesion s
                    JOIN clase c ON s.id_clase = c.id_clase
                    JOIN sesion_programada sp ON s.id_sesion = sp.id_sesion
                    GROUP BY c.nombre, sp.fecha
                    ORDER BY c.nombre, sp.fecha;
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


export const distribucionGeneroPorEstado = async (req, res) => {
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
                        ec.estado,
                        SUM(CASE WHEN g.genero = 'Masculino' THEN 1 ELSE 0 END) AS hombres,
                        SUM(CASE WHEN g.genero = 'Femenino' THEN 1 ELSE 0 END) AS mujeres,
                        COUNT(*) AS total
                    FROM cliente c
                    JOIN persona p ON c.cedula = p.cedula
                    JOIN generos g ON p.genero = g.id_genero
                    JOIN estados_clientes ec ON c.estado = ec.id_estado
                    GROUP BY ec.estado;
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

export const promedioPorGrupoYCupos = async (req, res) => {
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
                    numero_grupo,
                    cupo_disponible,
                    cantidad_matriculados,
                    CASE 
                        WHEN cantidad_matriculados > cupo_disponible THEN 'Sobrecupo'
                        WHEN cantidad_matriculados = cupo_disponible THEN 'Lleno'
                        ELSE 'Disponible'
                    END AS estado
                FROM grupo;

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

