import Usuario from "../../types/Usuario";
import UsuarioRepository from "../repositories/Usuario.repository";
import { validarSenha } from "../utils/validators";
import Erro from "../../types/Erro";
import { criptografarSenha } from "../utils/senhas";

async function createUsuarioService(data: Usuario) {
	const senha = data.senha as string;
	let erro: Erro | undefined = undefined;

	if (senha) {
		const senhaValida = validarSenha(senha);
		
		if (!senhaValida) {
			if (!erro) {
				erro = {
					codigo: 400,
					erro: {},
				};
			}
			
			erro.erro.senha = "Senha inválida";
		}
		
		data.senha = await criptografarSenha(senha)
	}

	const resposta = await UsuarioRepository.createUsuario(data);

	const usuario = {
		...resposta.usuario,
		senha: undefined
	}

	if(resposta.erro) {
		erro = {
			codigo: resposta.erro.codigo,
			erro: {
				...erro?.erro,
				...resposta.erro.erro
			}
		}
	}

	if (erro) {
		throw {
			codigo: erro.codigo,
			erro: erro.erro,
		};
	}

	return usuario;
}

export default createUsuarioService;
