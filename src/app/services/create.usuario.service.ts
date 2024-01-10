import Usuario from "../../types/Usuario";
import UsuarioRepository from "../repositories/Usuario.repository";
import bcrypt from "bcrypt";
import { validarSenha } from "../utils/validators";
import Erro from "../../types/Erro";

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
		
		const salt = await bcrypt.genSalt(6);
		const hash = await bcrypt.hash(senha, salt);
		
		data.senha = senha;
	}

	const resposta = await UsuarioRepository.createUsuario(data);

	const usuario = resposta.usuario

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
