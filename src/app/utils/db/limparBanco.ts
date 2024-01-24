import ConnectDB from "../../../config/database_config";
import EntidadeModel from "../../models/Entidade";
import FarmaciaModel from "../../models/Farmacia";
import UsuarioModel from "../../models/Usuario";

async function limparBanco() {
	await UsuarioModel.deleteMany();
	await EntidadeModel.deleteMany();
	await FarmaciaModel.deleteMany();
}

try {
	ConnectDB();
	limparBanco().then((res) => {
		console.log("Banco limpo com sucesso");
	});
} catch (error) {
	console.log(error);
}

export default limparBanco;
