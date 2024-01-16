import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../../types/Requests";
import jwt from "jsonwebtoken";
import TokenData from "../../types/TokenData";
import findUsuarioService from "../services/find.usuario.service";
import Erro from "../../types/Erro";
import { verificarToken } from "../utils/jwt";

const AuthenticationMiddleware: RequestHandler = async function (
	req: AuthenticatedRequest,
	res,
	next
) {
	const respostaErro = "É necessário estar autenticado para usar esta rota";

	try {
		let token = req.headers["authorization"];

		if (!token || !token.startsWith("Bearer ")) {
			throw {
				codigo: 401,
				erro: respostaErro,
			} as Erro;
		}

		token = token.split(" ")[1];

		const decoded = verificarToken<TokenData>(token)

		if (!decoded) {
			throw {
				codigo: 401,
				erro: respostaErro,
			} as Erro;
		}

		const usuario = await findUsuarioService(decoded.id);

		if (!usuario) {
			throw {
				codigo: 401,
				erro: respostaErro,
			} as Erro;
		}

		req.user = decoded;
	} catch (err: any) {
		const { codigo, erro } = err as Erro;

		res.status(codigo).send(erro);
	}

	next();
};

export default AuthenticationMiddleware;
