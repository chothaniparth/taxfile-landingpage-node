import { dbConection } from "../config/db.js";

// Get Designation List
export const getrelations = async (req, res) => {
  const sequelize = await dbConection();

  try {
    let query = `SELECT * FROM tblrelation WHERE 1=1`;

    const [data] = await sequelize.query(query);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, Success: false });
  } finally {
    await sequelize.close();
  }
};
