import app, { configApp } from "../../../app/app";
import {
	criarUsuarioAdm,
	criarUsuarioInativo,
} from "../../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../../app/utils/db/limparBanco";
import request from "supertest";
import { generateToken } from "../../../app/utils/jwt";
import UsuarioRepository from "../../../app/repositories/Usuario.repository";

configApp(true);

let email = "";
let token = "";

beforeAll(async () => {
	const { usuario: dados } = await criarUsuarioAdm();
	await criarUsuarioInativo();

	token = generateToken(
		{
			nome_usuario: dados.nome_usuario,
			id: dados._id,
		},
		30 * 60,
	);

	email = dados.email;
});

afterAll(async () => {
	await limparBanco();
});

describe("A rota esqueceu-senha", () => {
	it("deve enviar um email ao usuário com o token de recuperação", async () => {
		const resposta = await request(app)
			.post("/esqueceu-senha")
			.set("Accept", "application/json")
			.send({
				email,
			})
			.expect(200)
			.then((res) => res.text);

		expect(resposta).toBe(`Token de recuperação enviado para ${email}`);
	}, 10000);

	it("deve retornar erro ao não informar email", async () => {
		const resposta = await request(app)
			.post("/esqueceu-senha")
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Email é obrigatório");
	});

	it("deve retornar erro ao não informar email", async () => {
		const resposta = await request(app)
			.post("/esqueceu-senha")
			.set("Accept", "application/json")
			.send({
				email: "usuarioinativo@gmail.com",
			})
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe("O usuário ainda está inativo, espere sua ativação");
	});
});

describe("A rota de recuperação", () => {
	beforeAll(async () => {
		await request(app)
			.post("/esqueceu-senha")
			.set("Accept", "application/json")
			.send({
				email,
			})
			.then((res) => res.text);

		await UsuarioRepository.findUsuario({ email }).then((usuario) => {
			token = usuario?.token_recuperacao || "";
		});
	}, 10000);

	it("deve realizar a alteração de senha do usuário", async () => {
		const resposta = await request(app)
			.put("/recuperar-senha/")
			.set("Accept", "application/json")
			.set("Authorization", token)
			.send({
				senha: "12345678Asdf.",
			})
			.then((res) => res.text);

		expect(resposta).toBe("Senha alterada com sucesso");
	}, 10000);

	it("deve validar a nova senha", async () => {
		const resposta = await request(app)
			.put(`/recuperar-senha/`)
			.set("Accept", "application/json")
			.set("Authorization", token)
			.send({
				senha: "12345678",
			})
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Senha inválida");
	}, 10000);

	it("deve retornar erro ao informar token inválido", async () => {
		const resposta = await request(app)
			.put("/recuperar-senha/")
			.set("Accept", "application/json")
			.set("Authorization", "tokeninvalido")
			.send({
				senha: "12345678Asdf.",
			})
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Token de recuperação inválido");
	}, 10000);

	it("deve retornar erro ao não informar senha", async () => {
		const resposta = await request(app)
			.put(`/recuperar-senha/`)
			.set("Accept", "application/json")
			.set("Authorization", token)
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Senha é obrigatório");
	}, 10000);
});
