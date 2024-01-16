import jwt from "jsonwebtoken";
import TokenData from "../../types/TokenData";
import Usuario from "../../types/Usuario";

function generateToken(data: any) {
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
			expiresIn: "6h",
		}
	);

	return token;
}

function generateTokenFromUser(user: any) {
	const { email, dados_administrativos, _id, nome_usuario, numero_registro } = user;

try {
		if (!email || !dados_administrativos || !_id || !nome_usuario || !numero_registro) {
			throw {};
		}

		const data = {
			email,
			funcao: dados_administrativos.funcao,
			id: _id,
			nome_usuario,
			numero_registro,
		};

		const token = generateToken(data);

		return token;
	} catch (error) {
		return undefined;
	}
}

export { generateToken, generateTokenFromUser };
