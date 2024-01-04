import request from "supertest";
import { Types } from "mongoose";
import app from "../../app/app";
import Entidade from "../../types/Entidade";

const token = process.env.TEST_TOKEN;

const entidade = new Entidade({
	estado: "Rondônia",
	municipio: "Vilhena",
	nome_entidade: "Ministério da Saúde",
});

let entidade_id = "";

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

		expect(resposta).toEqual(entidade);
	});

	it("deve retornar erro ao não informar o token de autorização", async () => {
		const resposta = await request(app)
			.post("/entidade")
			.set("Accept", "application/json")
			.send(entidade)
			.expect(401);

		expect(resposta).toEqual("Não autenticado");
	});

	it("deve retornar erro ao tentar cadastrar entidade inválida", async () => {
		const resposta = await request(app)
			.post("/entidade")
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send({})
			.expect(400);

		expect(resposta).toBe(
			"Não foi possível cadastrar entidade: Estado é obrigatório, Município é obrigatório, Nome da entidade é obrigatório"
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

		expect(resposta).toContainEqual(entidade);
	});
});

describe("Rota para exibição de entidade", () => {
	it("deve retornar a entidade cadastrada anteriormente", async () => {
		const resposta = await request(app)
			.get(`/entidade/${entidade_id}`)
			.set("Accept", "aplication/json")
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toEqual(entidade);
	});

	it("deve retornar erro ao informar um Id Inválido", async () => {
		const resposta = await request(app)
			.get("/entidade/idinvalido")
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toBe("Id Inválido");
	});

	it("deve retornar erro de entidade não encontrado", async () => {
		const resposta = await request(app)
			.get(`/entidade/${new Types.ObjectId()}`)
			.set("Accept", "aplication/json")
			.expect(404)
			.then((res) => res.body);

		expect(resposta).toBe("Não foi possível encontrar a entidade");
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
				nome_entidade: ""
			})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toBe("Não foi possível atualizar a entidade: Nome da entidade inválido")
	})

	it("deve retornar erro caso o usuário não esteja autenticado", async () => {
		const resposta = await request(app)
			.put(`/entidade/${entidade_id}`)
			.set("Accept", "application/json")
			.send({
				...entidade
			})
			.expect(401)
			.then((res) => res.body);

		expect(resposta).toBe("Não autenticado")
	})
});

describe("Rota para exclusão de entidade", () => {
	it("deve retornar erro ao tentar excluir uma entidade não existente", async () => {
		const resposta = await request(app)
			.delete(`/entidade/${new Types.ObjectId()}`)
			.set("Authorization", `Bearer ${token}`)
			.set("Accept", "application/json")
			.expect(404)
			.then((res) => res.body);

		expect(resposta).toBe("Não foi possível encontrar a entidade");
	})
})
