import UsuarioRepository from "../repositories/Usuario.repository";
import { generateToken } from "../utils/jwt";

async function recuperarSenhaService(email: string | undefined) {
	if (!email) {
		throw {
			codigo: 400,
			erro: "Email é obrigatório",
		};
	}

	const usuario = await UsuarioRepository.findUsuario({ email });

	if (usuario) {
		const { email, nome_usuario } = usuario;
		const expiraEm = 30 * 60 * 1000
		const token = generateToken({ email, nome_usuario }, expiraEm);

		console.log(token);
	}
}

export default recuperarSenhaService;
