import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../../app/app";

describe("Rota de login", () => {
	it("deve realizar login e retornar um token", async () => {
		const resposta = await request(app)
			.post("/login")
			.set("Accept", "application/json")
			.send({
				nome_usuario: "administrador2024",
				senha: "12345678",
			})
			.expect(201)
			.then((res) => res.body);

		expect(jwt.verify(resposta, process.env.SECRET_KEY || "")).not.toThrow();
	});
});
