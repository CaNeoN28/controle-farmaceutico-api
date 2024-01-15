import Erro from "../../types/Erro";
import UsuarioRepository from "../repositories/Usuario.repository";

async function updateUsuarioService(id: string, data: any) {
	const { usuario, erro: erros } = await UsuarioRepository.updateUsuario(
		id,
		data
	);

	if (erros) {
		const { codigo, erro } = erros;
		
		throw {
			codigo,
			erro,
		} as Erro;
	}

	return usuario;
}

export default updateUsuarioService;
