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

let tokenAdm = "";
let tokenGerente = "";
let tokenBaixo = "";

let usuarioId = new mongoose.Types.ObjectId();
let usuarioBaixo: any = undefined;
let usuarioGerente: any = undefined;
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

	usuarioGerente = await criarUsuario({
		cpf: usuario.cpf,
		email: "usuariogerente@gmail.com",
		nome_completo: "Usuário Gerente",
		nome_usuario: "usuariogerente",
		numero_registro: "0",
		senha: "12345678Asdf.",
		dados_administrativos: {
			entidade_relacionada: new mongoose.Types.ObjectId(),
			funcao: "GERENTE",
		},
	});

	tokenAdm = generateTokenFromUser(adm)!;
	tokenBaixo = generateTokenFromUser(usuarioBaixo)!;
	tokenGerente = generateTokenFromUser(usuarioGerente)!;
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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
			.set("Authorization", `Bearer ${tokenAdm}`)
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

describe("A rota de atualização de usuários", () => {
	it("deve atualizar os dados de um usuário corretamente", async () => {
		const resposta = await request(app)
			.put(`/usuario/${usuarioId}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({
				nome_completo: "Nome alterado",
			})
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toHaveProperty("nome_completo", "Nome alterado");
	});

	it("deve realizar validação dos dados do usuário", async () => {
		const resposta = await request(app)
			.put(`/usuario/${usuarioId}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({
				dados_administrativos: {
					funcao: "FUNCAO",
				},
			})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toHaveProperty(
			"dados_administrativos.funcao",
			"Função em dados administrativos inválida"
		);
	});

	it("deve retornar erro ao tentar alterar os dados do próprio usuário", async () => {
		const admId = usuarioAdm._id;

		const resposta = await request(app)
			.put(`/usuario/${admId}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({})
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe(
			"Não é possível alterar seus próprios dados usando esta rota"
		);
	});

	it("deve retornar erro ao tentar alterar os dados do próprio usuário", async () => {
		const admId = usuarioAdm._id;

		const resposta = await request(app)
			.put(`/usuario/${admId}`)
			.set("Authorization", `Bearer ${tokenGerente}`)
			.set("Accept", "application/json")
			.send({})
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe(
			"Não é possível alterar os dados de um usuário de nível superior"
		);
	});

	it("deve retornar erro ao tentar alterar a função de um usuário para ser maior que a própria", async () => {
		const usuarioId = usuarioBaixo._id;

		const resposta = await request(app)
			.put(`/usuario/${usuarioId}`)
			.set("Authorization", `Bearer ${tokenGerente}`)
			.set("Accept", "application/json")
			.send({
				dados_administrativos: {
					funcao: "ADMINISTRADOR",
				},
			})
			.expect(403)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			"dados_administrativos.funcao":
				"Não foi possível alterar a função do usuário",
		});
	});

	it("deve retornar erro ao tentar alterar um usuário sem estar autenticado", async () => {
		const resposta = await request(app)
			.put(`/usuario/${usuarioId}`)
			.set("Accept", "application/json")
			.send({})
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});

	it("deve retornar erro ao tentar alterar um usuário como um usuário de nível baixo", async () => {
		const resposta = await request(app)
			.put(`/usuario/${usuarioId}`)
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${tokenBaixo}`)
			.send({})
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe(
			"É necessário ser gerente ou superior para realizar esta ação"
		);
	});
});

describe("A rota para deletar usuários", () => {
	it("deve retornar erro ao tentar remover um usuário sem estar autenticado", async () => {
		const resposta = await request(app)
			.delete(`/usuario/${usuarioId}`)
			.set("Accept", "application/json")
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});

	it("deve retornar erro ao tentar remover um usuário como um usuário de nível baixo", async () => {
		const resposta = await request(app)
			.delete(`/usuario/${usuarioId}`)
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${tokenBaixo}`)
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe(
			"É necessário ser gerente ou superior para realizar esta ação"
		);
	});

	it("deve retornar erro ao tentar remover um usuário de nível superior", async () => {
		const admId = usuarioAdm._id;

		const resposta = await request(app)
			.delete(`/usuario/${admId}`)
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${tokenGerente}`)
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe(
			"Não é possível remover um usuário de nível superior"
		);
	});

	it("deve retornar erro ao tentar remover o próprio usuário", async () => {
		const admId = usuarioAdm._id;

		const resposta = await request(app)
			.delete(`/usuario/${admId}`)
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toBe("Não é possível remover o prório usuário");
	});

	it("deve remover um usuário com sucesso do banco de dados", async () => {
		const resposta = await request(app)
			.delete(`/usuario/${usuarioId}`)
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.expect(204)
			.then((res) => res.body);

		expect(resposta).toEqual({});
	});
});
