import Erro from "../../types/Erro";
import UsuarioRepository from "../repositories/Usuario.repository";

async function deleteUsuarioService(id: string, idGerenciador: string) {
	if (id == idGerenciador) {
		throw {
			codigo: 403,
			erro: "Não é possível remover o próprio usuário",
		};
	}

	const erro = await UsuarioRepository.deleteUsuario(id, idGerenciador);

	if (erro) {
		throw erro;
	}
}

export default deleteUsuarioService;
