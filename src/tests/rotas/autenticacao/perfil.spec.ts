import request from "supertest";
import UsuarioModel from "../../../app/models/Usuario";
import { criarUsuarioAdm } from "../../../app/utils/gerarDadosDiversos";
import { generateToken } from "../../../app/utils/jwt";
import ILogin from "../../../types/ILogin";
import app from "../../../app/app";

let admin: ILogin = {
	senha: "",
	usuario: "",
};

let usuario: any = {};

let token = "";

beforeAll(async () => {
	admin = await criarUsuarioAdm();
	usuario = await UsuarioModel.findOne(
		{ nome_usuario: admin.usuario },
		{ senha: false }
	);

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

describe("A rota de visualização de perfil", () => {
	it("deve retornar o perfil do usuário que estiver logado", async () => {
		const resposta = await request(app)
			.post("/perfil")
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatch(usuario);
		expect(resposta.senha).toBeUndefined()
	});
});