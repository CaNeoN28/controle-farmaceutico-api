import { RequestHandler } from "express";
import Usuario from "../../types/Usuario";
import createUsuarioService from "../services/create.usuario.service";

class UsuariosControllers {
	static PegarUsuarioPorId: RequestHandler = async function (req, res, next) {
		res.send("Pegar usuário por Id");
	};

	static ListarUsuarios: RequestHandler = async function (req, res, next) {
		res.send("Listar usuários");
	};

	static CriarUsuario: RequestHandler = async function (req, res, next) {
		const {
			cpf,
			email,
			nome_completo,
			nome_usuario,
			numero_registro,
			senha,
			dados_administrativos,
			imagem_url,
		} = req.body as Usuario;

		const data = {
			cpf,
			email,
			nome_completo,
			nome_usuario,
			numero_registro,
			senha,
			dados_administrativos,
			imagem_url,
		};

		try {
			const resposta = await createUsuarioService(data)

			return res.status(201).send(resposta)
		} catch (error) {
			next(error)
		}
	};

	static AtualizarUsuario: RequestHandler = async function (req, res, next) {
		res.send("Atualizar usuário");
	};

	static RemoverUsuário: RequestHandler = async function (req, res, next) {
		res.send("Remover um usuário");
	};
}
export default UsuariosControllers;
