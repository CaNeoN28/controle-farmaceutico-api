import app from "./app/app";
import ConnectDB from "./config/database_config";
import * as dotenv from "dotenv";

async function start() {
	dotenv.config();
	const { PORT } = process.env

	await ConnectDB();

	app.listen(PORT, () => {
		console.log(`Servidor escutando em localhost:${PORT}`)
	})
}

start();
