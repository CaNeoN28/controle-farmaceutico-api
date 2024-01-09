import { RequestHandler } from "express";
import Usuario, { IUsuario } from "../../types/Usuario";
import createUsuarioService from "../services/create.usuario.service";
import Erro from "../../types/Erro";

class AutenticacaoControllers {
	static Cadastro: RequestHandler = async function (req, res, next) {
		const data = req.body as IUsuario;

		try {
			const usuario = new Usuario(data);

			const resposta = await createUsuarioService(usuario);
			
			return res.status(201).send(resposta);
		} catch (error: any) {
			const {codigo, erro} = error as Erro
			
			return res.status(codigo).send(erro);
		}
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
