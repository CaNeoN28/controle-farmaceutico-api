import UsuarioModel from "../../models/Usuario";

async function limparBanco() {
	await UsuarioModel.deleteMany();
}

export default limparBanco;
