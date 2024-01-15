import jwt from "jsonwebtoken";
import TokenData from "../../types/TokenData";

function generateToken(data: TokenData) {
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
