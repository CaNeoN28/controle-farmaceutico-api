import Erro from "../../types/Erro";
import UsuarioRepository from "../repositories/Usuario.repository";
import { generateTokenFromUser } from "../utils/jwt";

interface Data {
	nome_usuario: string;
	senha: string;
}

async function loginService(data: Data) {
	const {usuario, senhaCorreta} = await UsuarioRepository.login(data);

	if (usuario && senhaCorreta) {
		if(usuario.dados_administrativos.funcao == "INATIVO"){
			throw {
				codigo: 403,
				erro: "O usuário ainda não foi verificado"
			} as Erro
		}

		const token = generateTokenFromUser(usuario);

		if(!token){
			throw {
				codigo: 403,
				erro: "Usuário inválido"
			}
		}

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
