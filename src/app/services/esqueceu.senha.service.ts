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

		await UsuarioRepository.adicionarTokenRecuperacao(id, token);

		await enviarEmail({
			assunto: "Link para recuperação de senha",
			para: email,
			template: "recoveryEmail",
			contexto: {
				recoveryLink: `${FRONTEND_URL}/recuperar-senha?token=${token}`,
				// appLogoUrl: `${FRONTEND_URL}/favicon.svg`,
				appLogoUrl: "https://raw.githubusercontent.com/CaNeoN28/controle-farmaceutico-frontend/c8d753f175f9c485d2a5d726b78a07ec488bbf8d/public/favicon.svg",
				usuario: nome_usuario
			},
		});
	}
}

export default esqueceuSenhaService;
