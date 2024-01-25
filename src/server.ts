import app from "./app/app";
import * as dotenv from "dotenv";
import swaggerSetup from "./docs/head";
import ConnectDB from "./config/database_config";
import route from "./app/routes";

async function start() {
	dotenv.config();
	const { PORT } = process.env;

	swaggerSetup(app);
	ConnectDB()

	route(app);

	app.listen(PORT, () => {
		console.log(`Servidor escutando em localhost:${PORT}`);
	});
}

start();
