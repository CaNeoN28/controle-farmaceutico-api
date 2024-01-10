import UsuarioModel from "../../../app/models/Usuario";
import { criarUsuarioAdm } from "../../../app/utils/gerarDadosDiversos";
import { generateToken } from "../../../app/utils/jwt";
import ILogin from "../../../types/ILogin";

let admin: ILogin = {
	senha: "",
	usuario: "",
};

let token = "";

beforeAll(async () => {
	admin = await criarUsuarioAdm();
	const usuario = await UsuarioModel.findOne({ nome_usuario: admin.usuario });

	if (usuario) {
		token = generateToken({
			email: usuario.email,
			funcao: usuario.dados_administrativos.funcao,
			id: usuario.id,
			nome_usuario: usuario.nome_usuario,
			numero_registro: usuario.numero_registro,
		});
	}
});

afterAll(async () => {
	await UsuarioModel.deleteMany();
});

describe("A rota de visualização de perfil deve", () => {});
