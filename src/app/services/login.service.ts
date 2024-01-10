import UsuarioRepository from "../repositories/Usuario.repository";
import { generateToken } from "../utils/jwt";

interface Data {
	nome_usuario: string;
	senha: string;
}

async function loginService(data: Data) {
	const usuario = await UsuarioRepository.findUsuario({
		nome_usuario: data.nome_usuario,
	});

	if (usuario) {
		const token = generateToken({
			email: usuario.email,
			funcao: usuario.dados_administrativos.funcao,
			nome_usuario: usuario.nome_usuario,
			numero_registro: usuario.numero_registro,
		});

		return {
			usuario,
			token: token,
		};
	}
}

export default loginService;
