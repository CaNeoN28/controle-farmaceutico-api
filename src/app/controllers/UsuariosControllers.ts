import { RequestHandler } from "express";
import Usuario, { FiltrosUsuario } from "../../types/Usuario";
import createUsuarioService from "../services/create.usuario.service";
import findUsuarioService from "../services/find.usuario.service";
import listUsuariosService from "../services/list.usuario.service";
import { PaginacaoQuery } from "../../types/Paginacao";
import selfUpdateUsuarioService from "../services/self.update.usuario.service";
import { AuthenticatedRequest } from "../../types/Requests";
import updateUsuarioService from "../services/update.usuario.service";
import deleteUsuarioService from "../services/delete.usuario.service";

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
		const params = req.query;

		try {
			const resposta = await listUsuariosService(params);

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

	static AtualizarUsuario: RequestHandler = async function (
		req: AuthenticatedRequest,
		res,
		next
	) {
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

		const user = req.user!;

		const { id } = req.params;

		try {
			const resposta = await updateUsuarioService(
				id,
				{
					cpf,
					email,
					nome_completo,
					nome_usuario,
					numero_registro,
					senha,
					dados_administrativos,
					imagem_url,
				},
				user.id
			);

			return res.status(200).send(resposta);
		} catch (error) {
			next(error);
		}
	};

	static RemoverUsuário: RequestHandler = async function (
		req: AuthenticatedRequest,
		res,
		next
	) {
		const { id } = req.params;
		const idGerenciador = req.user!.id;

		try {
			const resposta = await deleteUsuarioService(id);

			res.status(204).send();
		} catch (error) {
			next(error);
		}
	};
}
export default UsuariosControllers;
