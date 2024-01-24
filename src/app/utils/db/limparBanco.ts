import EntidadeModel from "../../models/Entidade";
import FarmaciaModel from "../../models/Farmacia";
import UsuarioModel from "../../models/Usuario";

async function limparBanco() {
	await UsuarioModel.deleteMany();
	await EntidadeModel.deleteMany();
	await FarmaciaModel.deleteMany();
}

export default limparBanco;
