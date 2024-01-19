import Erro from "../../types/Erro";
import UsuarioRepository from "../repositories/Usuario.repository";
import { validarSenha } from "../utils/validators";

async function selfUpdateUsuarioService(id: string, data: any) {
	let erro: Erro | undefined = undefined;

	if (data.senha && !validarSenha(data.senha)) {
		erro = {
			codigo: 400,
			erro: {
				senha: "Senha inválida"
			}
		}
	}

	const { usuario, erros } = await UsuarioRepository.updateUsuario(id, data);

	if(erros) {
		erro = {
			codigo: erros.codigo,
			erro: {
				...erro?.erro,
				...erros.erro
			}
		}
	}

	if(erro){
		throw erro as Erro
	}

	return usuario;
}

export default selfUpdateUsuarioService;
