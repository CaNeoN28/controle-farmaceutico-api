import Erro from "../../types/Erro";
import ImagemRepository from "../repositories/Imagem.repository";
import UsuarioRepository from "../repositories/Usuario.repository";

async function deleteUsuarioService(id: string, idGerenciador: string) {
	if (id == idGerenciador) {
		throw {
			codigo: 403,
			erro: "Não é possível remover o próprio usuário",
		};
	}

	const {erro, usuario} = await UsuarioRepository.deleteUsuario(id, idGerenciador);

	if (erro) {
		throw erro;
	}

	if (usuario && usuario.imagem_url)
			await ImagemRepository.removerImagem(
				"usuario",
				usuario.id,
				usuario.imagem_url
			);
}

export default deleteUsuarioService;
