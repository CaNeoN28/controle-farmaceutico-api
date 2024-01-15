import UsuarioRepository from "../repositories/Usuario.repository";
import Erro from "../../types/Erro";

async function findUsuarioService(id: string) {
	try {
		const usuario = await UsuarioRepository.findUsuarioId(id);

		if (usuario) {
			return usuario;
		}

		throw {
			codigo: 404,
			erro: "Usuário não encontrado"
		} as Erro;
	} catch (error: any) {
		const { codigo, erro } = error as Erro;

		throw {
			codigo,
			erro,
		} as Erro;
	}
}

export default findUsuarioService;
