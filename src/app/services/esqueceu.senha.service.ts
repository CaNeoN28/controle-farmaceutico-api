import UsuarioRepository from "../repositories/Usuario.repository";
import enviarEmail from "../utils/enviarEmail";
import { generateToken } from "../utils/jwt";
import * as dotenv from "dotenv";

async function esqueceuSenhaService(email: string | undefined) {
	dotenv.config();

	const FRONTEND_URL = process.env.FRONTEND_URL || "";

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

		const { nome_usuario, id } = usuario;
		const expiraEm = 30 * 60;
		const token = generateToken({ nome_usuario }, expiraEm);

		await UsuarioRepository.selfUpdateUsuario(id, { token_recuperacao: token });

		await enviarEmail({
			assunto: "Link para recuperação de senha",
			para: email,
			texto: `Link para recuperação da senha ${FRONTEND_URL}/recuperar-senha?token=${token}`,
		});
	}
}

export default esqueceuSenhaService;
