import UsuarioRepository from "../repositories/Usuario.repository";

async function updateUsuarioService(id: string, data: any) {
	const { usuario, erro } = await UsuarioRepository.updateUsuario(id, data);

	return usuario
}

export default updateUsuarioService;
