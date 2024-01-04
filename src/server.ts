import ConnectDB from "./config/database_config";
import * as dotenv from "dotenv"

async function start() {
	dotenv.config()
	
	await ConnectDB()
}

start()