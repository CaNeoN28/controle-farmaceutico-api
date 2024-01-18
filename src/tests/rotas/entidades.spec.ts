import request from "supertest";
import { Types } from "mongoose";
import app from "../../app/app";
import Entidade from "../../types/Entidade";
import { generateTokenFromUser } from "../../app/utils/jwt";
import limparBanco from "../../app/utils/db/limparBanco";
import {
	criarUsuario,
	criarUsuarioAdm,
} from "../../app/utils/db/gerarDadosDiversos";

let usuario: any = undefined;
let token = "";

const entidade = new Entidade({
	estado: "Rondônia",
	municipio: "Vilhena",
	nome_entidade: "Ministério da Saúde",
});

let usuarioBaixo: any = undefined;
let tokenBaixo = "";

let entidade_id = new Types.ObjectId();

beforeAll(async () => {
	usuario = (await criarUsuarioAdm()).usuario;
	token = generateTokenFromUser(usuario)!;

	usuarioBaixo = await criarUsuario({
		cpf: "60643036032",
		email: "usuariobaixo@gmail.com",
		nome_completo: "Usuário Baixo",
		nome_usuario: "usuariobaixo",
		numero_registro: "0000",
		senha: "12345678Asdf",
		dados_administrativos: {
			entidade_relacionada: new Types.ObjectId(),
			funcao: "USUARIO",
		},
	});
	tokenBaixo = generateTokenFromUser(usuarioBaixo)!;
});

afterAll(async () => {
	limparBanco();
});

describe("Rota de cadastro de entidades", () => {
	it("deve cadastrar uma entidade", async () => {
		const resposta = await request(app)
			.post("/entidade")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(entidade)
			.expect(201)
			.then((res) => res.body);

		entidade_id = resposta._id;

		expect(resposta).toMatchObject(entidade);
	});

	it("deve retornar erro ao tentar cadastrar entidade inválida", async () => {
		const resposta = await request(app)
			.post("/entidade")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send({})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			estado: "Estado é obrigatório",
			municipio: "Município é obrigatório",
			nome_entidade: "Nome da entidade é obrigatório",
		});
	});

	it("deve retornar erro ao não informar o token de autorização", async () => {
		const resposta = await request(app)
			.post("/entidade")
			.set("Accept", "application/json")
			.send(entidade)
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toEqual(
			"É necessário estar autenticado para usar esta rota"
		);
	});

	it("não deve permitir criação de entidades para usuários de nível baixo", async () => {
		const resposta = await request(app)
			.post("/entidade")
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${tokenBaixo}`)
			.send(entidade)
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toEqual(
			"É preciso ser gerente ou superior para realizar essa ação"
		);
	});
});

describe("Rota de listagem de entidades", () => {
	it("deve retornar uma lista com a entidade recém cadastrada", async () => {
		const resposta = await request(app)
			.get("/entidades")
			.set("Accept", "aplication/json")
			.expect(200)
			.then((res) => res.body);

		expect(resposta.dados[0]).toMatchObject(entidade);
	});

	it("deve retornar dados de paginação", async () => {
		const resposta = await request(app)
			.get(`/entidades?pagina=1&limite=10`)
			.set("Accept", "aplication/json")
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			pagina: 1,
			limite: 10,
			paginas_totais: 1,
			documentos_totais: 1
		});
		expect(resposta.dados[0]).toMatchObject(entidade);
	});

	it("deve retornar dados de paginação mais um array vazio", async () => {
		const resposta = await request(app)
			.get(`/entidades?pagina=2&limite=10`)
			.set("Accept", "aplication/json")
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			pagina: 2,
			limite: 10,
			paginas_totais: 1,
			documentos_totais: 1
		});
		expect(resposta.dados[0]).toBeUndefined();
	});

	it("deve retornar erro caso os dados de paginação estejam inválidos", async () => {
		const resposta = await request(app)
			.get(`/entidades`)
			.query("pagina=paginainvalida")
			.query("limite=limiteinvalido")
			.set("Accept", "aplication/json")
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			pagina: "Pagina inválida",
			limite: "Limite inválido"
		});
	})
});

describe("Rota para exibição de entidade", () => {
	it("deve retornar a entidade cadastrada anteriormente", async () => {
		const resposta = await request(app)
			.get(`/entidade/${entidade_id}`)
			.set("Accept", "aplication/json")
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject(entidade);
	});

	it("deve retornar erro ao informar um Id Inválido", async () => {
		const resposta = await request(app)
			.get("/entidade/idinvalido")
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Id inválido");
	});

	it("deve retornar erro de entidade não encontrado", async () => {
		const resposta = await request(app)
			.get(`/entidade/${new Types.ObjectId()}`)
			.set("Accept", "aplication/json")
			.expect(404)
			.then((res) => res.text);

		expect(resposta).toBe("Entidade não encontrada");
	});
});

describe("Rota para atualização de entidade", () => {
	it("deve alterar os dados de uma entidade", async () => {
		const resposta = await request(app)
			.put(`/entidade/${entidade_id}`)
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send({
				...entidade,
				municipio: "Ji-Paraná",
			})
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toEqual({
			...entidade,
			municipio: "Ji-Paraná",
		});
	});

	it("deve validar os atributos informados", async () => {
		const resposta = await request(app)
			.put(`/entidade/${entidade_id}`)
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send({
				...entidade,
				nome_entidade: "",
			})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			nome_entidade: "Nome da entidade inválido",
		});
	});

	it("deve retornar erro ao não informar o token de autorização", async () => {
		const resposta = await request(app)
			.put(`/entidade/${entidade_id}`)
			.set("Accept", "application/json")
			.send({
				...entidade,
			})
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toEqual(
			"É necessário estar autenticado para usar esta rota"
		);
	});

	it("não deve permitir atualização de entidades para usuários de nível baixo", async () => {
		const resposta = await request(app)
			.put(`/entidade/${entidade_id}`)
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${tokenBaixo}`)
			.send(entidade)
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toEqual(
			"É preciso ser gerente ou superior para realizar essa ação"
		);
	});
});

describe("Rota para exclusão de entidade", () => {
	it("deve retornar erro ao tentar excluir uma entidade não existente", async () => {
		const resposta = await request(app)
			.delete(`/entidade/${new Types.ObjectId()}`)
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.expect(404)
			.then((res) => res.text);

		expect(resposta).toBe("Não foi possível encontrar a entidade");
	});

	it("deve retornar erro de Id Inválido", async () => {
		const resposta = await request(app)
			.delete("/entidade/idinvalido")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Id inválido");
	});

	it("deve realizar uma exclusão bem sucedida", async () => {
		const resposta = await request(app)
			.delete(`/entidade/${entidade_id}`)
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.expect(204)
			.then((res) => res.body);

		expect(resposta).toBe(undefined);
	});

	it("deve retornar erro ao não informar o token de autorização", async () => {
		const resposta = await request(app)
			.delete(`/entidade/${entidade_id}`)
			.set("Accept", "application/json")
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toEqual(
			"É necessário estar autenticado para usar esta rota"
		);
	});

	it("não deve permitir que entidades sejam removidas por usuários de nível baixo", async () => {
		const resposta = await request(app)
			.delete(`/entidade/${entidade_id}`)
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${tokenBaixo}`)
			.expect(403)
			.then((res) => res.text);

		expect(resposta).toEqual(
			"É preciso ser gerente ou superior para realizar essa ação"
		);
	});
});
