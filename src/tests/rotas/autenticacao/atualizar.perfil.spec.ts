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
				email: "administrador@gmail.com",
			})
			.expect(200)
			.then((res) => res.body);
		const atualizado = await UsuarioModel.findById(usuario._id);

		expect(resposta).not.toHaveProperty("senha")

		expect(resposta).toHaveProperty("email", "administrador@gmail.com");
		expect(atualizado).toHaveProperty("email", "administrador@gmail.com");
	});

	it("não deve alterar dados administrativos", async () => {
		const dadosAlterados = {
			dados_administrativos: {
				funcao: "USUARIO",
			},
			cpf: "00000000000",
			nome_completo: "Administrador Júnior",
			numero_registro: "000",
		};

		const resposta = await request(app)
			.put("/perfil/atualizar")
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send(dadosAlterados)
			.expect(200)
			.then((res) => res.body);
		const atualizado = await UsuarioModel.findById(usuario._id);

		expect(resposta).not.toMatchObject(dadosAlterados);
		expect(atualizado).not.toMatchObject(dadosAlterados);
	});

	it("deve realizar validação dos dados", async () => {
		const dadosAlterados = {
			senha: "12345678",
			email: "emailinvalido",
		};

		const resposta = await request(app)
			.put("/perfil/atualizar")
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${token}`)
			.send(dadosAlterados)
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toHaveProperty("email", "Email inválido");
		expect(resposta).toHaveProperty("senha", "Senha inválida");
	});

	it("deve precisar de autenticação", async () => {
		const resposta = await request(app)
			.put("/perfil/atualizar")
			.set("Accept", "application/json")
			.send({})
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});
});
