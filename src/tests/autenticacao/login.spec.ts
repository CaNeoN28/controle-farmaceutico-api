import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../app/app";
import { criarUsuarioAdm } from "../../app/utils/gerarDadosDiversos";
import limparBanco from "../../app/utils/limparBanco";
import Usuario from "../../types/Usuario";

let {
	administrador,
	senha,
}: {
	administrador?: string;
	senha?: string;
} = {};

beforeAll(async () => {
	const resposta = await criarUsuarioAdm();

	administrador = resposta.usuario;
	senha = resposta.senha;
});

afterAll(async () => {
	await limparBanco();
});

describe("Rota de login", () => {
	it("deve realizar login e retornar um token", async () => {
		const resposta = await request(app)
			.post("/login")
			.set("Accept", "application/json")
			.send({
				nome_usuario: administrador,
				senha: senha,
			})
			.expect(200)
			.then((res) => res.body);

		const { token, usuario } = resposta as {
			token: string;
			usuario: Usuario;
		};

		const verificarToken = () => {
			const payload = jwt.verify(token, process.env.SECRET_KEY || "");

			return payload;
		};

		expect(usuario).toHaveProperty("nome_usuario", administrador);
		expect(usuario.senha).toBeUndefined();
		expect(verificarToken).not.toThrow();

		const payload = verificarToken();

		expect(payload).toHaveProperty("nome_usuario", administrador);
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
			.then((res) => res.text);

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
			.then((res) => res.text);

		expect(resposta).toBe("O usuário ainda não foi verificado");
	});
});
