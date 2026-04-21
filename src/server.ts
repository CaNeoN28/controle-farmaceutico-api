import app, { configApp } from "./app/app";
import * as dotenv from "dotenv";
import swaggerSetup from "./docs/head";

async function start() {
	dotenv.config();
	const { PORT = 3030 } = process.env;

	swaggerSetup(app);
	configApp()

	app.listen(PORT, () => {
		console.log(`Servidor escutando em localhost:${PORT}`);
	});
}

start();
