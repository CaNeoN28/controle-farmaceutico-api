import app from "../../../app/app";
import UsuarioModel from "../../../app/models/Usuario";
import { criarUsuarioAdm } from "../../../app/utils/gerarDadosDiversos";
import { generateToken } from "../../../app/utils/jwt";
import limparBanco from "../../../app/utils/limparBanco";
import ILogin from "../../../types/ILogin";
import request from "supertest";

let login: ILogin = {
	usuario: "",
	senha: "",
};
let usuario: any = {};
let token = "";

beforeAll(async () => {
	login = await criarUsuarioAdm();
	usuario = await UsuarioModel.findOne({
		nome_usuario: login.usuario,
	});

	if (usuario) {
		token = generateToken({
			email: usuario.email,
			funcao: usuario.dados_administrativos.funcao,
			id: usuario._id,
			nome_usuario: usuario.nome_usuario,
			numero_registro: usuario.numero_registro,
		});
	}
});

afterAll(async () => {
	await limparBanco();
});

describe("A rota de atualizar perfil", () => {
	it("deve alterar os dados do usuário que estiver autenticado", async () => {
		const resposta = await request(app)
			.put("/perfil/atualizar")
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send({
				email: "administrador@gmail.com"
			})
			.expect(200)
			.then((res) => res.body);
		const atualizado = await UsuarioModel.findById(usuario._id)

		expect(resposta).toHaveProperty("email", "administrador@gmail.com")
		expect(atualizado).toHaveProperty("email", "administrador@gmail.com")
	});
});
