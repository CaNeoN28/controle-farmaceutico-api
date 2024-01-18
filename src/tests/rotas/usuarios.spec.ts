import request from "supertest";
import { criarUsuarioAdm } from "../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../app/utils/db/limparBanco";
import { generateTokenFromUser } from "../../app/utils/jwt";
import app from "../../app/app";
import Usuario from "../../types/Usuario";
import mongoose from "mongoose";

let token = "";

const usuario = new Usuario({
	cpf: "06408728081",
	email: "emailaleatorio12@gmail.com",
	nome_completo: "Usuário Teste",
	nome_usuario: "usuarioteste",
	numero_registro: "0",
	senha: "12345678Asdf.",
	dados_administrativos: {
		entidade_relacionada: new mongoose.Types.ObjectId(),
		funcao: "USUARIO",
	},
});

beforeAll(async () => {
	const { usuario } = await criarUsuarioAdm();
	token = generateTokenFromUser(usuario)!;
});

afterAll(async () => {
	limparBanco();
});

describe("A rota de cadastro de usuários", () => {
	it("deve cadastrar um usuário", async () => {
		const {cpf, email, nome_completo, nome_usuario, numero_registro, dados_administrativos} = usuario

		const resposta = await request(app)
			.post("/entidade")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(201)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cpf,
			email,
			nome_completo,
			nome_usuario,
			numero_registro,
			dados_administrativos
		} as Usuario)
	});
});
