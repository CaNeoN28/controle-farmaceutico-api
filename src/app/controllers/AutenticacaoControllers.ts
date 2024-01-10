import { RequestHandler } from "express";
import Usuario, { IUsuario } from "../../types/Usuario";
import createUsuarioService from "../services/create.usuario.service";
import Erro from "../../types/Erro";
import loginService from "../services/login.service";

class AutenticacaoControllers {
	static Cadastro: RequestHandler = async function (req, res, next) {
		const data = req.body as IUsuario;

		try {
			const usuario = new Usuario(data);

			const resposta = await createUsuarioService(usuario);

			return res.status(201).send(resposta);
		} catch (error: any) {
			const { codigo, erro } = error as Erro;
			return res.status(codigo).send(erro);
		}
	};

	static Login: RequestHandler = async function (req, res, next) {
		try {
			const { nome_usuario, senha } = req.body;

			const resposta = loginService({ nome_usuario, senha });

			res.status(200).send(resposta);
		} catch (error: any) {
			const erro = error as Erro;

			res.status(erro.codigo).send(erro.erro);
		}
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
