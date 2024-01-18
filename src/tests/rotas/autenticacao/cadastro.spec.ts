import request from "supertest";
import { Types } from "mongoose";
import app from "../../../app/app";
import Usuario from "../../../types/Usuario";
import limparBanco from "../../../app/utils/db/limparBanco";

let usuario: any = {}

beforeAll(async () => {
	usuario = new Usuario({
		cpf: "01880090007",
		email: `antoniobandeira@gmail.com`,
		imagem_url: ".jpg",
		nome_completo: "Antônio José Bandeira",
		nome_usuario: `antoniobandeira10`,
		numero_registro: "0000000",
		senha: "12345678Asdf.",
	});
})


afterAll(async () => {
	await limparBanco();
});

describe("Rota de cadastro de usuário", () => {
	it("deve criar um novo usuário no banco de dados", async () => {
		const resposta = await request(app)
			.post("/cadastro")
			.set("Accept", "application/json")
			.send(usuario)
			.expect(201)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cpf: usuario.cpf,
			email: usuario.email,
			imagem_url: usuario.imagem_url,
			nome_completo: usuario.nome_completo,
			nome_usuario: usuario.nome_usuario,
			numero_registro: usuario.numero_registro,
		});

		expect(resposta.dados_administrativos).toMatchObject({
			funcao: "ADMINISTRADOR"
		})

		expect(resposta.senha).toBeUndefined();
	});

	it("deve retornar erro  de senha inválida", async () => {
		const resposta = await request(app)
			.post("/cadastro")
			.set("Accept", "application/json")
			.send({
				...usuario,
				nome_usuario: "outronomedeusuario",
				email: "outroemail@gmail.com",
				senha: "12345678",
			})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toHaveProperty("senha", "Senha inválida")
	});

	it("deve retornar erro ao usar um email já existente", async () => {
		const resposta = await request(app)
			.post("/cadastro")
			.set("Accept", "application/json")
			.send({
				email: usuario.email
			})
			.expect(409)
			.then((res) => res.body);

		expect(resposta).toMatchObject({ email: "Email já cadastrado" });
	});

	it("deve retornar erro ao usar um nome de usuário já existente", async () => {
		const resposta = await request(app)
			.post("/cadastro")
			.set("Accept", "application/json")
			.send({
				nome_usuario: usuario.nome_usuario
			})
			.expect(409)
			.then((res) => res.body);

		expect(resposta).toMatchObject({ nome_usuario: "Nome de usuário já cadastrado" });
	});

	it("deve retornar erro ao enviar um usuário inválido", async () => {
		const resposta = await request(app)
			.post("/cadastro")
			.set("Accept", "application/json")
			.send({})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cpf: "CPF é obrigatório",
			email: "Email é obrigatório",
			nome_completo: "Nome completo é obrigatório",
			nome_usuario: "Nome de usuário é obrigatório",
			numero_registro: "Número de registro é obrigatório",
			senha: "Senha é obrigatório",
			"dados_administrativos.entidade_relacionada":
				"Entidade relacionada é obrigatório",
		});
	});
});
