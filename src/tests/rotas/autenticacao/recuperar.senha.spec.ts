import app from "../../../app/app";
import { criarUsuarioAdm } from "../../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../../app/utils/db/limparBanco";
import request from "supertest";

let usuario: any = undefined;
let email = "";

beforeAll(async () => {
	const { usuario: dados } = await criarUsuarioAdm();

	usuario = dados;
	email = dados.email;
});

afterAll(async () => {
	await limparBanco();
});

describe("A rota esqueceu-senha", () => {
	it("deve enviar um email ao usuário com o token de recuperação", async () => {
		const resposta = await request(app)
			.post("/esqueceu-senha")
			.set("Accept", "application/json")
			.send({
				email,
			})
			.expect(200)
			.then((res) => res.text);

		expect(resposta).toBe(`Token de recuperação enviado para ${email}`)
	});
});
