import { RequestHandler } from "express";
import Usuario, { IUsuario } from "../../types/Usuario";
import createUsuarioService from "../services/create.usuario.service";
import loginService from "../services/login.service";
import { AuthenticatedRequest } from "../../types/Requests";
import findUsuarioService from "../services/find.usuario.service";
import selfUpdateUsuarioService from "../services/self.update.usuario.service";
import recuperarSenhaService from "../services/recuperar.senha.service";
import esqueceuSenhaService from "../services/esqueceu.senha.service";

class AutenticacaoControllers {
	static Cadastro: RequestHandler = async function (req, res, next) {
		const data = req.body as IUsuario;

		try {
			const usuario = new Usuario(data);

			const resposta = await createUsuarioService(usuario);

			return res.status(201).send(resposta);
		} catch (error) {
			next(error);
		}
	};

	static Login: RequestHandler = async function (req, res, next) {
		try {
			const { nome_usuario, senha } = req.body;

			const resposta = await loginService({ nome_usuario, senha });

			res.status(200).send(resposta);
		} catch (error: any) {
			next(error);
		}
	};

	static VisualizarPerfil: RequestHandler = async function (
		req: AuthenticatedRequest,
		res,
		next
	) {
		const userData = req.user!;

		try {
			const usuario = await findUsuarioService(userData.id);

			res.status(200).send(usuario);
		} catch (error: any) {
			next(error);
		}
	};

	static AtualizarPerfil: RequestHandler = async function (
		req: AuthenticatedRequest,
		res,
		next
	) {
		const user = req.user!;

		try {
			const { nome_usuario, email, senha, imagem_url } = req.body;

			const resposta = await selfUpdateUsuarioService(user.id, {
				nome_usuario,
				email,
				senha,
				imagem_url,
			});

			res.status(200).send(resposta);
		} catch (error) {
			next(error);
		}
	};

	static EsqueceuSenha: RequestHandler = async function (req, res, next) {
		const { email } = req.body;

		try {
			await esqueceuSenhaService(email);

			res.status(200).send(`Token de recuperação enviado para ${email}`);
		} catch (error) {
			console.log(error);
			next(error);
		}
	};

	static RecuperarSenha: RequestHandler = async function (req, res, next) {
		const { token } = req.params;
		const { senha } = req.body;

		try {
			await recuperarSenhaService(token, senha);

			res.status(200).send("Senha alterada com sucesso");
		} catch (error) {
			next(error);
		}
	};
}
export default AutenticacaoControllers;
