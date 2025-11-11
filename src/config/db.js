import { Sequelize } from "sequelize";

export const dbConection = async () => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 15000; // 3 seconds

  let attempt = 0;
  let masterConnection;

  while (attempt < MAX_RETRIES) {
    try {
      masterConnection = new Sequelize(
        process.env.MASTER_DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_SERVER,
          dialect: "mssql",
          dialectOptions: {
            options: {
              encrypt: true,
              trustServerCertificate: true,
              trustedConnection: true,
            },
          },
          logging: false,
        }
      );

      await masterConnection.authenticate();
      // console.log("✅ Database connected successfully...");
      return masterConnection;

    } catch (err) {
      attempt++;
      console.error(`❌ Database connection attempt ${attempt} failed:`, err.message);

      if (attempt < MAX_RETRIES) {
        console.log(`🔁 Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      } else {
        console.error("❌ All retry attempts failed. Could not connect to the database.");
        throw err;
      }
    }
  }
};
