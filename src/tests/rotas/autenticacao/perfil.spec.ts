import request from "supertest";
import UsuarioModel from "../../../app/models/Usuario";
import { criarUsuarioAdm } from "../../../app/utils/gerarDadosDiversos";
import { generateToken } from "../../../app/utils/jwt";
import ILogin from "../../../types/ILogin";
import app from "../../../app/app";
import Usuario from "../../../types/Usuario";

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
			.get("/perfil")
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cpf: usuario.cpf,
			email: usuario.email,
			nome_completo: usuario.nome_completo,
			nome_usuario: usuario.nome_usuario,
			numero_registro: usuario.numero_registro,
			dados_administrativos: {
				entidade_relacionada:
					usuario.dados_administrativos.entidade_relacionada.toString(),
				funcao: usuario.dados_administrativos.funcao,
			},
			imagem_url: usuario.imagem_url,
		} as Usuario);
		expect(resposta.senha).toBeUndefined();
	});

	it("deve retornar erro no caso de token inválido", async () => {
		const resposta = await request(app)
			.get("/perfil")
			.set("Accept", "application/json")
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});
});
