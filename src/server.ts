import ConnectDB from "./config/database_config";

async function start() {
	await ConnectDB()
}

start()