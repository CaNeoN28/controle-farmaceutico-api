import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../../types/Requests";
import jwt from "jsonwebtoken";
import TokenData from "../../types/TokenData";
import findUsuarioService from "../services/find.usuario.service";

const AuthenticationMiddleware: RequestHandler = async function (
	req: AuthenticatedRequest,
	res,
	next
) {
	const respostaErro = "É necessário estar autenticado para usar esta rota";

	try {
		let token = req.headers["authorization"];

		if (!token || !token.startsWith("Bearer ")) {
			return res.status(401).send(respostaErro);
		}

		try {
			token = token.split(" ")[1];

			const decoded = jwt.verify(
				token,
				process.env.SECRET_KEY || ""
			) as TokenData;

			const usuario = await findUsuarioService(decoded.id);

			if (!usuario) {
				res.status(401).send(respostaErro);
			}

			req.user = decoded;
		} catch {
			res.status(401).send();
		}
	} catch {
		return res.status(500).send(respostaErro);
	}

	next();
};

export default AuthenticationMiddleware;
