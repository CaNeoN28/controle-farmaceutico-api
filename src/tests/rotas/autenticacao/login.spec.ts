import request from "supertest";
import app from "../../../app/app";
import { criarUsuarioAdm, criarUsuarioInativo } from "../../../app/utils/db/gerarDadosDiversos";
import Usuario from "../../../types/Usuario";
import ILogin from "../../../types/ILogin";
import limparBanco from "../../../app/utils/db/limparBanco";
import TokenData from "../../../types/TokenData";
import { verificarToken } from "../../../app/utils/jwt";

let administrador: ILogin = {
	usuario: "",
	senha: ""
}

let inativo: ILogin = {
	usuario: "",
	senha: ""
}

beforeAll(async () => {
	administrador = (await criarUsuarioAdm()).dadosLogin;
	inativo = await criarUsuarioInativo()
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
				nome_usuario: administrador.usuario,
				senha: administrador.senha,
			})
			.expect(200)
			.then((res) => res.body);

		const { token, usuario } = resposta as {
			token: string;
			usuario: Usuario;
		};

		const checkToken = () => {
			const payload = verificarToken<TokenData>(token);

			return payload;
		};

		expect(usuario).toHaveProperty("nome_usuario", administrador.usuario);
		expect(usuario.senha).toBeUndefined();
		expect(checkToken).not.toThrow();

		const payload = checkToken();

		expect(payload).toHaveProperty("nome_usuario", administrador.usuario);
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
				nome_usuario: inativo.usuario,
				senha: inativo.senha,
			})
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe("O usuário ainda não foi verificado");
	});
});
