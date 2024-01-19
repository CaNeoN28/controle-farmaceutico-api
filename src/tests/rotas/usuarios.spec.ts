import request from "supertest";
import {
	criarUsuario,
	criarUsuarioAdm,
} from "../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../app/utils/db/limparBanco";
import { generateTokenFromUser } from "../../app/utils/jwt";
import app from "../../app/app";
import Usuario from "../../types/Usuario";
import mongoose from "mongoose";

let token = "";
let tokenBaixo = "";

let usuarioId = new mongoose.Types.ObjectId();
let usuarioBaixo: any = undefined;
let usuarioAdm: any = undefined;

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
	const { usuario: adm } = await criarUsuarioAdm();
	token = generateTokenFromUser(adm)!;

	usuarioAdm = adm;

	usuarioBaixo = await criarUsuario({
		cpf: usuario.cpf,
		email: "emailbaixo@gmail.com",
		nome_completo: "Usuário baixo",
		nome_usuario: "usuariobaixo",
		numero_registro: "0",
		senha: "12345678Asdf",
		dados_administrativos: {
			entidade_relacionada: new mongoose.Types.ObjectId(),
			funcao: "USUARIO",
		},
	});

	tokenBaixo = generateTokenFromUser(usuarioBaixo)!;
});

afterAll(async () => {
	limparBanco();
});

describe("A rota de cadastro de usuários", () => {
	it("deve cadastrar um usuário", async () => {
		const {
			cpf,
			email,
			nome_completo,
			nome_usuario,
			numero_registro,
			dados_administrativos,
		} = usuario;

		const resposta = await request(app)
			.post("/usuario")
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
			dados_administrativos,
		} as Usuario);

		expect(resposta).toHaveProperty("_id");

		usuarioId = resposta._id;
	});

	it("deve realizar teste de validação de atributos obrigatórios", async () => {
		const resposta = await request(app)
			.post("/usuario")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(usuario)
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

	it("deve realizar validação dos atributos de usuário", async () => {
		const resposta = await request(app)
			.post("/usuario")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send({
				cpf: "00000000000",
				email: "emailinvalido",
				nome_completo: "N",
				nome_usuario: "__nome_usuario__",
				numero_registro: "Numero Inválido",
				senha: "12345678",
				dados_administrativos: {
					entidade_relacionada: "0",
					funcao: "FUNCAO",
				},
			})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cpf: "CPF inválido",
			email: "Email inválido",
			nome_completo: "Nome completo inválido",
			nome_usuario: "Nome de usuário inválido",
			numero_registro: "Número de registro inválido",
			senha: "Senha inválida",
			"dados_administrativos.entidade_relacionada":
				"Entidade relacionada inválida",
			"dados_administrativos.funcao":
				"Função em dados administrativos inválida",
		});
	});

	it("deve retornar erro ao tentar criar um usuário sem token de autorização", async () => {
		const resposta = await request(app)
			.post("/usuario")
			.set("Accept", "application/json")
			.send(usuario)
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});

	it("deve retornar erro ao tentar criar um usuário com um usuário de nível baixo", async () => {
		const resposta = await request(app)
			.post("/usuario")
			.set("Authorization", `Bearer ${tokenBaixo}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe(
			"É preciso ser gerente ou superior para realizar essa ação"
		);
	});
});

describe("A rota de recuperação de usuário", () => {
	it("deve retornar o usuário cadastrado anteriormente", async () => {
		const {
			cpf,
			email,
			nome_completo,
			nome_usuario,
			numero_registro,
			dados_administrativos,
		} = usuario;

		const resposta = await request(app)
			.get(`/usuario/${usuarioId}`)
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cpf,
			email,
			nome_completo,
			nome_usuario,
			numero_registro,
			dados_administrativos,
		});

		expect(resposta).not.toHaveProperty("senha");
	});

	it("deve retornar o erro ao informar um id inválido", async () => {
		const resposta = await request(app)
			.get(`/usuario/idinvalido`)
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(200)
			.then((res) => res.text);

		expect(resposta).toBe("Id inválido");
	});

	it("deve retornar erro de usuário não encontrado", async () => {
		const idFalso = new mongoose.Types.ObjectId();

		const resposta = await request(app)
			.get(`/usuario/${idFalso}`)
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(404)
			.then((res) => res.text);

		expect(resposta).toBe("Usuário não encontrado");
	});

	it("deve retornar erro ao tentar usar a rota sem um token de autenticação", async () => {
		const resposta = await request(app)
			.get(`/usuario/${usuarioId}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("Você deve estar autenticado para usar esta rota");
	});
});

describe("A rota de listagem de usuários", () => {
	it("deve retornar uma lista com os dados do usuário cadastrado anteriormente", async () => {
		const resposta = await request(app)
			.get("/usuarios")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			limite: 10,
			pagina: 1,
			paginas_totais: 1,
			documentos_totais: 3,
		});

		expect(resposta.dados[1]).toMatchObject(usuario);
	});

	it("não deve retornar dados de usuário por página inexistente", async () => {
		const resposta = await request(app)
			.get("/usuarios")
			.query("pagina=2")
			.query("limite=2")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			limite: 2,
			pagina: 2,
			paginas_totais: 1,
			documentos_totais: 3,
		});

		expect(resposta.dados[0]).toMatchObject(usuarioBaixo);
	});

	it("deve retornar um usuário administrador com base nos filtros", async () => {
		const resposta = await request(app)
			.get("/usuarios")
			.query("funcao=ADMINISTRADOR")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(usuario)
			.expect(200)
			.then((res) => res.body);

		expect(resposta.documentos_totais).toBe(1);
		expect(resposta.dados[0]).toMatchObject(usuario);
	});

	it("deve exigir token para exibição de usuário", async () => {
		const resposta = await request(app)
			.get("/usuarios")
			.set("Accept", "application/json")
			.send(usuario)
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É preciso estar autenticado para usar esta rota");
	});
});
