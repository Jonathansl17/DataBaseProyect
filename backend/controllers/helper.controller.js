import { getConnection } from "../config/conectionStore.js";


const getDistritos = async (req, res) => {
    const { connection } = getConnection();

    if (!connection) {
        return res.status(400).json({
            success: false,
            message: "No active SQL Server connection",
        });
    }

    try {
        const result = await connection.request().query("SELECT * FROM distritos");
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error("Error executing get_distritos procedure: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export default getDistritos