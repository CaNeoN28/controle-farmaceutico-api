import { verificarToken } from "../utils/jwt";

interface Payload {
	nome_usuario: string;
	email: string;
}

async function recuperarSenhaService(token?: string) {
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
}

export default recuperarSenhaService;
