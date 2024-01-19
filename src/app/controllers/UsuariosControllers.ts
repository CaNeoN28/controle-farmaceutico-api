import { RequestHandler } from "express";
import Usuario, { FiltrosUsuario } from "../../types/Usuario";
import createUsuarioService from "../services/create.usuario.service";
import findUsuarioService from "../services/find.usuario.service";
import listUsuariosService from "../services/list.usuario.service";

class UsuariosControllers {
	static PegarUsuarioPorId: RequestHandler = async function (req, res, next) {
		const { id } = req.params;

		try {
			const resposta = await findUsuarioService(id);

			return res.status(200).send(resposta);
		} catch (error) {
			next(error);
		}
	};

	static ListarUsuarios: RequestHandler = async function (req, res, next) {
		const { entidade_relacionada, cpf, funcao, nome_usuario }: FiltrosUsuario =
			req.query as any;

		try {
			const resposta = await listUsuariosService({
				entidade_relacionada,
				cpf,
				funcao,
				nome_usuario,
			});

			return res.status(200).send(resposta);
		} catch (error) {
			res.send(error);
		}
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
			const resposta = await createUsuarioService(data);

			return res.status(201).send(resposta);
		} catch (error) {
			next(error);
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
