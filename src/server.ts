import app from "./app/app";
import ConnectDB from "./config/database_config";
import * as dotenv from "dotenv";

async function start() {
	dotenv.config();
	const { DB_URL, PORT } = process.env

	await ConnectDB(DB_URL || "");

	app.listen(PORT, () => {
		console.log(`Servidor escutando em localhost:${PORT}`)
	})
}

start();
