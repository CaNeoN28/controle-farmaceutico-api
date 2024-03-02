import Erro from "../../types/Erro";
import UsuarioRepository from "../repositories/Usuario.repository";
import { verificarToken } from "../utils/jwt";

export default async function verificarTokenRecuperacaoService(token: string) {
	const payload = verificarToken(token) as { nome_usuario: string };

	if (!payload) {
		throw {
			codigo: 401,
			erro: "Token inválido",
		} as Erro;
	}

	const { usuario } = await UsuarioRepository.verificarToken(
		payload.nome_usuario
	);

	if (!usuario || (usuario && usuario.token_recuperacao != token)) {
		throw {
			codigo: 401,
			erro: "Token inválido",
		} as Erro;
	}
}
