import UsuarioRepository from "../repositories/Usuario.repository";
import { verificarToken } from "../utils/jwt";
import { criptografarSenha } from "../utils/senhas";
import { validarSenha } from "../utils/validators";

interface Payload {
	id: string;
	nome_usuario: string;
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

	senha = await criptografarSenha(senha);

	const { id } = payload;
	const usuario = await UsuarioRepository.findUsuarioId(id);

	if (usuario) {
		if (!usuario.token_recuperacao) {
			throw {
				codigo: 400,
				erro: "Token de recuperação inválido",
			};
		}
		if (usuario.token_recuperacao != token)
			throw {
				codigo: 400,
				erro: "Token de recuperação inválido",
			};
	}

	const { erros } = await UsuarioRepository.selfUpdateUsuario(id, {
		senha,
		token_recuperacao: null,
	});

	if (erros) {
		throw erros;
	}
}

export default recuperarSenhaService;
