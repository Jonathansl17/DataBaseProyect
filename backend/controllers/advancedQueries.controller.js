import { getConnection } from "../config/conectionStore.js";

export const ranking_clientes = async (req, res) => {
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
                    COUNT(cc.id_clase) AS total_clases,
                    RANK() OVER (ORDER BY COUNT(cc.id_clase) DESC) AS posicion
                FROM cliente_clase cc
                JOIN persona p ON cc.cedula = p.cedula
                GROUP BY p.cedula, p.nombre, p.apellido1, p.apellido2;
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

export const clientes_membresia_vencida = async (req, res) => {
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

export const promedio_por_grupo_y_cupos = async (req, res) => {
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

export const distribuciondegenero_porEstado = async (req, res) => {
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

export const cantidad_sesion_por_fecha = async (req, res) => {
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