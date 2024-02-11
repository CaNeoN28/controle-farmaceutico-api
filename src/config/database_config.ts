import * as dotenv from "dotenv";
import mongoose from "mongoose";

async function ConnectDB() {
	dotenv.config();

	const { DB_URL } = process.env;

	mongoose.set("strictQuery", true);

	await mongoose
		.connect(DB_URL || "")
		.then((res) => {
			console.log("Conexão com o banco de dados bem sucedida");
		})
		.catch((error) => {
			console.log(`Não foi possível se conectar ao banco de dados: ${error}`);
		});

	mongoose.connection.on(
		"error",
		console.log.bind(console, "Conexão com o banco de dados falhou")
	);

	mongoose.connection.once("open", () => {
		console.log("Conexão com o banco de dados estabelecida");
	});

	return mongoose.connection
}

export default ConnectDB;
