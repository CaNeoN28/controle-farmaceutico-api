import Erro from "../../types/Erro";
import UsuarioRepository from "../repositories/Usuario.repository";
import { generateToken } from "../utils/jwt";

interface Data {
	nome_usuario: string;
	senha: string;
}

async function loginService(data: Data) {
	const {usuario, senhaCorreta} = await UsuarioRepository.login(data);

	if (usuario && senhaCorreta) {
		const token = generateToken({
			email: usuario.email,
			funcao: usuario.dados_administrativos.funcao,
			nome_usuario: usuario.nome_usuario,
			numero_registro: usuario.numero_registro,
		});

		return {
			usuario: {
				...usuario,
				senha: undefined
			},
			token: token,
		};
	}

	throw {codigo: 401, erro: "Não foi possível realizar autenticação"} as Erro
}

export default loginService;
