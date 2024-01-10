import UsuarioRepository from "../repositories/Usuario.repository";

interface Data {
	nome_usuario: string;
	senha: string;
}

async function loginService(data: Data) {
	const usuario = await UsuarioRepository.findUsuario({
		nome_usuario: data.nome_usuario,
	});

	return {
		usuario,
		token: ""
	}
}

export default loginService;
