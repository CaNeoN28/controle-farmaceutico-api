import EntidadeModel from "../../models/Entidade";
import FarmaciaModel from "../../models/Farmacia";
import ImagemModel from "../../models/Imagem";
import UsuarioModel from "../../models/Usuario";

async function limparBanco() {
	await UsuarioModel.deleteMany();
	await EntidadeModel.deleteMany();
	await FarmaciaModel.deleteMany();
	await ImagemModel.deleteMany()
}

export default limparBanco;
