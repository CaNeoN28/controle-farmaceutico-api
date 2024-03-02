import UsuarioRepository from "../repositories/Usuario.repository";
import enviarEmail from "../utils/enviarEmail";
import { generateToken } from "../utils/jwt";

async function esqueceuSenhaService(email: string | undefined) {
	if (!email) {
		throw {
			codigo: 400,
			erro: "Email é obrigatório",
		};
	}

	const usuario = await UsuarioRepository.findUsuario({ email });

	if (usuario) {
		if (usuario.dados_administrativos.funcao == "INATIVO") {
			throw {
				codigo: 403,
				erro: "O usuário ainda está inativo, espere sua ativação",
			};
		}

		const { email, id } = usuario;
		const expiraEm = 30 * 60;
		const token = generateToken({ email, id }, expiraEm);

		console.log(token)

		await UsuarioRepository.selfUpdateUsuario(id, { token_recuperacao: token });

		await enviarEmail({
			assunto: "Link para recuperação de senha",
			para: email,
			texto: `Token para recuperação: ${token}`,
		});
	}
}

export default esqueceuSenhaService;
