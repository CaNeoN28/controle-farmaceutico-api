import { RequestHandler } from "express";

class UsuariosControllers {
	static PegarUsuarioPorId: RequestHandler = async function (req, res, next) {
		res.send("Pegar usuário por Id");
	};

	static ListarUsuarios: RequestHandler = async function (req, res, next) {
		res.send("Listar usuários");
	};

	static CriarUsuario: RequestHandler = async function (req, res, next) {
		res.send("Criar usuário");
	};

	static AtualizarUsuario: RequestHandler = async function (req, res, next) {
		res.send("Atualizar usuário");
	};

	static RemoverUsuário: RequestHandler = async function (req, res, next) {
		res.send("Remover um usuário");
	};
}
export default UsuariosControllers;
