import { RequestHandler } from "express";

class AutenticacaoControllers {
	static Cadastro: RequestHandler = async function (req, res, next) {
		res.send("Cadastro");
	};

	static Login: RequestHandler = async function (req, res, next) {
		res.send("Login");
	};

	static VisualizarPerfil: RequestHandler = async function (req, res, next) {
		res.send("Visualizar Perfil");
	};

	static AtualizarPerfil: RequestHandler = async function (req, res, next) {
		res.send("Atualizar Perfil");
	};

	static EsqueceuSenha: RequestHandler = async function (req, res, next) {
		res.send("Esqueceu Senha");
	};

	static RecuperarSenha: RequestHandler = async function (req, res, send) {
		res.send("Recuperar Senha");
	};
}
export default AutenticacaoControllers;
