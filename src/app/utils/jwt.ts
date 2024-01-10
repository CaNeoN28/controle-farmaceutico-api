import Usuario from "../../types/Usuario";
import jwt from "jsonwebtoken";

interface Data {
	email: string;
	numero_registro: string;
	nome_usuario: string;
	funcao: string;
}

function generateToken(data: Data) {
	const { SECRET_KEY } = process.env;
	const { email, numero_registro, nome_usuario, funcao } = data;
	const token = jwt.sign(
		{
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

export { generateToken };
