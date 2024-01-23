import UsuarioRepository from "../repositories/Usuario.repository";
import { generateToken } from "../utils/jwt";
import enviarEmail from "../utils/enviarEmail";

async function recuperarSenhaService(email: string | undefined) {
	if (!email) {
		throw {
			codigo: 400,
			erro: "Email é obrigatório",
		};
	}

	const usuario = await UsuarioRepository.findUsuario({ email });

	if (usuario) {
		if(usuario.dados_administrativos.funcao == "INATIVO"){
			throw {
				codigo: 403,
				erro: "O usuário ainda está inativo, espere sua ativação"
			}
		}

		const { email, nome_usuario } = usuario;
		const expiraEm = 30 * 60;
		const token = generateToken({ email, nome_usuario }, expiraEm);

		await enviarEmail({
			assunto: "Link para recuperação de senha",
			para: email,
			texto: `Token para recuperação: ${token}`,
		});
	}
}

export default recuperarSenhaService;
