import request from "supertest";
import { criarUsuarioAdm } from "../../../app/utils/db/gerarDadosDiversos";
import { generateTokenFromUser } from "../../../app/utils/jwt";
import ILogin from "../../../types/ILogin";
import app, { configApp } from "../../../app/app";
import Usuario from "../../../types/Usuario";
import limparBanco from "../../../app/utils/db/limparBanco";
import mongoose from "mongoose";

configApp();

let login: ILogin = {
	senha: "",
	usuario: "",
};

let usuario: any = {};

let token = "";
let token_falso = "";

beforeAll(async () => {
	const dados = await criarUsuarioAdm();
	const usuario_falso = {
		_id: new mongoose.Types.ObjectId(),
		email: "email@email.com",
		nome_usuario: "usuario",
		numero_registro: "0",
		dados_administrativos: {
			entidade_relacionada: new mongoose.Types.ObjectId(),
			funcao: "USUARIO"
		}
	};

	login = dados.dadosLogin;
	usuario = dados.usuario;

	token = generateTokenFromUser(usuario) || "";
	token_falso = generateTokenFromUser(usuario_falso) || "";
});

afterAll(async () => {
	await limparBanco();
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
			.set("Authorization", "Bearer tokeninvalido")
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});

	it("deve retornar erro ao não existir usuário", async () => {
		const resposta = await request(app)
			.get("/perfil")
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${token_falso}`)
			.expect(401)
			.then((res) => res.text);

		console.log(resposta);
	});
});
