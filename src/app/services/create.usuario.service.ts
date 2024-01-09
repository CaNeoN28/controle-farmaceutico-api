import Usuario from "../../types/Usuario";
import UsuarioRepository from "../repositories/Usuario.repository";

async function createUsuarioService(data: Usuario) {
	const {usuario, erro} = await UsuarioRepository.createUsuario(data)

	if(erro){
		throw {
			codigo: erro.codigo,
			erro: erro.erro
		}
	}

	return usuario
}

export default createUsuarioService;
