import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../app/app";
import criarUsuarioAdm from "../../app/utils/criarUsuarioAdm";
import limparBanco from "../../app/utils/limparBanco";

let {usuario, senha}: {
	usuario?: string,
	senha?: string
} = {}

beforeAll(async() => {
	const resposta = await criarUsuarioAdm()

	usuario = resposta.usuario
	senha = resposta.senha
})

afterAll(async() => {
	await limparBanco()
})

describe("Rota de login", () => {
	it("deve realizar login e retornar um token", async () => {
		const resposta = await request(app)
			.post("/login")
			.set("Accept", "application/json")
			.send({
				nome_usuario: usuario,
				senha: senha,
			})
			.expect(200)
			.then((res) => res.body);

		expect(jwt.verify(resposta, process.env.SECRET_KEY || "")).not.toThrow();
	});

	it("deve retornar erro com dados inválidos", async () => {
		const resposta = await request(app)
			.post("/login")
			.set("Accept", "application/json")
			.send({
				nome_usuario: "barrosaugusto",
				senha: "12345678",
			})
			.expect(401)
			.then((res) => res.body);

		expect(resposta).toBe("Não foi possível realizar autenticação");
	});

	it("deve retornar erro de usuário inativo na tentativa de login com usuário não validado", async () => {
		const resposta = await request(app)
			.post("/login")
			.set("Accept", "application/json")
			.send({
				nome_usuario: "usuarioinativo",
				senha: "12345678",
			})
			.expect(403)
			.then((res) => res.body);

		expect(resposta).toBe("O usuário ainda não foi verificado");
	});
});
