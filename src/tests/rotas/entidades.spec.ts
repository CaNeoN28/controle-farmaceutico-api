import request from "supertest";
import app from "../../app/app";

const token = process.env.TEST_TOKEN;

const entidade = new Entidade({
	estado: "Rondônia",
	municipio: "Vilhena",
	nome_entidade: "Ministério da Saúde",
});

describe("Rota de cadastro de entidades", () => {
	it("deve cadastrar uma entidade", async () => {
		const resposta = await request(app)
			.post("/entidade")
			.set("Authorizatin", `Bearer ${token}`)
			.set("Accept", "application/json")
			.send(entidade)
			.expect(201);

		expect(resposta).toEqual(entidade);
	});
});
