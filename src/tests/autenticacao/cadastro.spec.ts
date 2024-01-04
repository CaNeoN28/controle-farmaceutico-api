import request from "supertest";
import { Types } from "mongoose";
import app from "../../app/app";
import Usuario, { Funcao } from "../../types/Usuario";

const entidade_id = new Types.ObjectId()

const usuario = new Usuario({
	cpf: "018.800.900-07",
	dados_administrativos: {
		entidade_relacionada: entidade_id,
	},
	email: "email@gmail.com",
	imagem_url: ".jpg",
	nome_completo: "Antônio José Bandeira",
	nome_usuario: "antoniojose10",
	numero_registro: "0000000",
	senha: "12345678",
});

describe("Rota de cadastro de usuário", () => {
	it("deve criar um novo usuário no banco de dados", async () => {
		const resposta = await request(app)
			.post("/cadastro")
			.set("Accept", "application/json")
			.send(usuario)
			.expect(201)
			.then(res => res.body)

		expect(resposta).toEqual({
			cpf: "018.800.900-07",
			dados_administrativos: {
				entidade_relacionada: entidade_id,
				funcao: Funcao.ADMINISTRADOR
			},
			email: usuario.email,
			imagem_url: usuario.imagem_url,
			nome_completo: usuario.nome_completo,
			nome_usuario: usuario.nome_usuario,
			numero_registro: usuario.numero_registro
		})
	});
});
