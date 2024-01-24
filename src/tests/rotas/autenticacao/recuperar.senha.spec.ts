import app from "../../../app/app";
import {
	criarUsuarioAdm,
	criarUsuarioInativo,
} from "../../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../../app/utils/db/limparBanco";
import request from "supertest";
import { generateToken } from "../../../app/utils/jwt";

let email = "";
let token = "";

beforeAll(async () => {
	const { usuario: dados } = await criarUsuarioAdm();
	await criarUsuarioInativo();

	token = generateToken(
		{
			email: dados.email,
			id: dados._id,
		},
		30 * 60
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

describe("A rota de recuperação", () => {
	it("deve realizar a alteração de senha do usuário", async () => {
		const resposta = await request(app)
			.put(`/recuperar-senha/${token}`)
			.set("Accept", "application/json")
			.send({
				senha: "12345678Asdf.",
			})
			.expect(200)
			.then((res) => res.text);

		expect(resposta).toBe("Senha alterada com sucesso");
	});

	it("deve validar a nova senha", async () => {
		const resposta = await request(app)
			.put(`/recuperar-senha/${token}`)
			.set("Accept", "application/json")
			.send({
				senha: "12345678",
			})
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Senha inválida");
	});

	it("deve retornar erro ao informar token inválido", async () => {
		const resposta = await request(app)
			.put("/recuperar-senha/tokeninvalido")
			.set("Accept", "application/json")
			.send({
				senha: "12345678Asdf.",
			})
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Token de recuperação inválido");
	});

	it("deve retornar erro ao não informar senha", async () => {
		const resposta = await request(app)
			.put(`/recuperar-senha/${token}`)
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Senha é obrigatório");
	});
});
