import Usuario from "../../types/Usuario";
import UsuarioRepository from "../repositories/Usuario.repository";
import bcrypt from "bcrypt";
import { validarSenha } from "../utils/validators";
import Erro from "../../types/Erro";

async function createUsuarioService(data: Usuario) {
	const senha = data.senha;

	let { usuario, erro } = await UsuarioRepository.createUsuario(data);

	if (senha) {
		const senhaValida = validarSenha(senha as string);

		if (!senhaValida) {
			if (!erro) {
				erro = {
					codigo: 400,
					erro: {},
				};
			}

			erro.erro.senha = "Senha inválida"
		}
	}

	if (erro) {
		throw {
			codigo: erro.codigo,
			erro: erro.erro,
		};
	}

	return usuario;
}

export default createUsuarioService;
