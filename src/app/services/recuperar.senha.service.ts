import UsuarioRepository from "../repositories/Usuario.repository";
import { verificarToken } from "../utils/jwt";
import { validarSenha } from "../utils/validators";

interface Payload {
	nome_usuario: string;
	email: string;
}

async function recuperarSenhaService(token?: string, senha?: string) {
	if (!token) {
		throw {
			codigo: 400,
			erro: "Token de recuperação inválido",
		};
	}

	const payload = verificarToken<Payload>(token);

	if (!payload) {
		throw {
			codigo: 400,
			erro: "Token de recuperação inválido",
		};
	}

	if (!senha) {
		throw {
			codigo: 400,
			erro: "Senha é obrigatório",
		};
	}

	if (!validarSenha(senha)) {
		throw {
			codigo: 400,
			erro: "Senha inválida",
		};
	}
}

export default recuperarSenhaService;
