import request from "supertest";
import { Types } from "mongoose";
import app from "../../app/app";
import Usuario from "../../types/Usuario";
import UsuarioModel from "../../app/models/Usuario";

const entidade_id = new Types.ObjectId();

const usuario = new Usuario({
	cpf: "01880090007",
	dados_administrativos: {
		entidade_relacionada: entidade_id,
	},
	email: `antoniobandeira@gmail.com`,
	imagem_url: ".jpg",
	nome_completo: "Antônio José Bandeira",
	nome_usuario: `antoniobandeira10`,
	numero_registro: "0000000",
	senha: "12345678Asdf.",
});

afterAll(async () => {
	await UsuarioModel.deleteMany();
});

describe("Rota de cadastro de usuário", () => {
	it("deve criar um novo usuário no banco de dados", async () => {
		const resposta = await request(app)
			.post("/cadastro")
			.set("Accept", "application/json")
			.send(usuario)
			.expect(201)
			.then((res) => res.body);

		expect(resposta.senha).toBeUndefined()

		expect(resposta).toMatchObject({
			...usuario,
			dados_administrativos: {
				entidade_relacionada: entidade_id.toString(),
				funcao: "ADMINISTRADOR",
			},
		});
	});

	it("deve retornar erro ao usar um email já existente", async () => {
		const resposta = await request(app)
			.post("/cadastro")
			.set("Accept", "application/json")
			.send(usuario)
			.expect(409)
			.then((res) => res.body);

		expect(resposta).toMatchObject({ email: "Email já cadastrado" });
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
