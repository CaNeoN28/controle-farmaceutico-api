import app from "../../../app/app";
import {
	criarUsuarioAdm,
	criarUsuarioInativo,
} from "../../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../../app/utils/db/limparBanco";
import request from "supertest";

let email = "";

beforeAll(async () => {
	const { usuario: dados } = await criarUsuarioAdm();
	await criarUsuarioInativo();

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
	});

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
