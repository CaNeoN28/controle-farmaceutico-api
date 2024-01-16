import EntidadeModel from "../../models/Entidade";
import UsuarioModel from "../../models/Usuario";

async function limparBanco() {
	await UsuarioModel.deleteMany();
	await EntidadeModel.deleteMany()
}

export default limparBanco;
