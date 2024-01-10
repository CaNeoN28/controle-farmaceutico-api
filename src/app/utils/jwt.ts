import Usuario from "../../types/Usuario";
import jwt from "jsonwebtoken";

function generateToken(data: Usuario) {
	const { SECRET_KEY } = process.env;
	const { email, numero_registro, nome_usuario, dados_administrativos } = data;
	const token = jwt.sign(
		{
			email,
			numero_registro,
			nome_usuario,
			funcao: dados_administrativos?.funcao,
		},
		SECRET_KEY || "",
		{
			expiresIn: "6h",
		}
	);

	return token
}

export {
	generateToken
}