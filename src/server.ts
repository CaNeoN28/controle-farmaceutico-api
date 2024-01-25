import app from "./app/app";
import * as dotenv from "dotenv";
import swaggerSetup from "./docs/head";
import ConnectDB from "./config/database_config";

async function start() {
	dotenv.config();
	const { PORT } = process.env;

	swaggerSetup(app);
	ConnectDB()

	app.listen(PORT, () => {
		console.log(`Servidor escutando em localhost:${PORT}`);
	});
}

start();
