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

	it("deve retornar erro de entidade não encontrado", async () => {
		const resposta = await request(app)
			.get(`/entidade/${new Types.ObjectId()}`)
			.set("Accept", "aplication/json")
			.expect(404)
			.then((res) => res.body);

		expect(resposta).toBe("Não foi possível encontrar a entidade")
	});
});
