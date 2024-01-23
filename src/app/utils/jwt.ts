import jwt from "jsonwebtoken";
import TokenData from "../../types/TokenData";
import Usuario from "../../types/Usuario";
import Erro from "../../types/Erro";

function generateToken(data: any, tempoExpiracao: number) {
	const { SECRET_KEY } = process.env;
	const { id, email, numero_registro, nome_usuario, funcao } = data;
	const token = jwt.sign(
		{
			id,
			email,
			funcao,
			nome_usuario,
			numero_registro,
		},
		SECRET_KEY || "",
		{
			expiresIn: tempoExpiracao,
		}
	);

	return token;
}

function verificarToken<T>(token: string) {
	const key = process.env.SECRET_KEY || "";

	try {
		const payload = jwt.verify(token, key) as T;
		return payload;
	} catch (err) {
		return false;
	}
}

function generateTokenFromUser(user: any) {
	const { email, dados_administrativos, _id, nome_usuario, numero_registro } =
		user;

	try {
		if (
			!email ||
			!dados_administrativos ||
			!_id ||
			!nome_usuario ||
			!numero_registro
		) {
			throw {};
		}

		const data = {
			email,
			funcao: dados_administrativos.funcao,
			id: _id,
			nome_usuario,
			numero_registro,
		};

		const expiraEm = 6 * 60 * 60

		const token = generateToken(data, expiraEm);

		return token;
	} catch (error) {
		return undefined;
	}
}

export { generateToken, generateTokenFromUser, verificarToken };
