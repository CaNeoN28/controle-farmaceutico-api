import Erro from "../../types/Erro";
import UsuarioRepository from "../repositories/Usuario.repository";
import { validarSenha } from "../utils/validators";

async function updateUsuarioService(
	id: string,
	data: any,
	idGerenciador: string
) {
	let erro: Erro | undefined = undefined;

	if (idGerenciador === id) {
		throw {
			codigo: 403,
			erro: "Não é possível alterar seus próprios dados usando esta rota",
		};
	}

	const { usuario, erros } = await UsuarioRepository.updateUsuario(
		id,
		data,
		idGerenciador
	);

	if (erro) {
		throw erro;
	}

	return usuario;
}

export default updateUsuarioService;
