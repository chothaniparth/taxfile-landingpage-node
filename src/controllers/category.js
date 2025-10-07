import { dbConection } from "../config/db.js";

export const getCategory = async (req, res) => {
  const sequelize = await dbConection();
  try {
    let query = `select * from CategoryMast WHERE 1=1`;
    const replacements = {};

    const [results] = await sequelize.query(query, { replacements });
    res.status(200).json({  results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    await sequelize.close();
  }
};
