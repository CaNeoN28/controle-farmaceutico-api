import * as dotenv from "dotenv";
import mongoose from "mongoose";

async function ConnectDB(test?: boolean) {
	dotenv.config();

	const {
		DB_URL = "mongodb://localhost:27017",
		DB_NAME = "controle-farmaceutico",
	} = process.env;

	mongoose.set("strictQuery", true);

	await mongoose
		.connect(DB_URL, { dbName: test ? `${DB_NAME}_test` : DB_NAME })
		.then((res) => {
			if (!test) console.log("Conexão com o banco de dados bem sucedida");
		})
		.catch((error) => {
			console.log(`Não foi possível se conectar ao banco de dados: ${error}`);
		});

	mongoose.connection.on(
		"error",
		console.log.bind(console, "Conexão com o banco de dados falhou"),
	);

	mongoose.connection.once("open", () => {
		console.log("Conexão com o banco de dados estabelecida");
	});

	return mongoose.connection;
}

export default ConnectDB;
