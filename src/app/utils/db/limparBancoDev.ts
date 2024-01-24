import ConnectDB from "../../../config/database_config";
import limparBanco from "./limparBanco";

async function limparBancoDev() {
	try {
		await ConnectDB();
		await limparBanco();

		console.log("Banco limpo");
	} catch (error) {
		console.log(error);
	}

	process.exit();
}

limparBancoDev();
