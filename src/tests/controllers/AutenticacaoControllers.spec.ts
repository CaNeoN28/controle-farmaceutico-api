import { Request, Response, NextFunction } from "express";
import AutenticacaoControllers from "../../app/controllers/AutenticacaoControllers";
import createUsuarioService from "../../app/services/create.usuario.service";
import loginService from "../../app/services/login.service";
import findUsuarioService from "../../app/services/find.usuario.service";
import selfUpdateUsuarioService from "../../app/services/self.update.usuario.service";
import recuperarSenhaService from "../../app/services/recuperar.senha.service";
import esqueceuSenhaService from "../../app/services/esqueceu.senha.service";
import verificarTokenRecuperacaoService from "../../app/services/verificar.recuperacao.service";

jest.mock("../../app/services/create.usuario.service");
jest.mock("../../app/services/login.service");
jest.mock("../../app/services/find.usuario.service");
jest.mock("../../app/services/self.update.usuario.service");
jest.mock("../../app/services/recuperar.senha.service");
jest.mock("../../app/services/esqueceu.senha.service");
jest.mock("../../app/services/verificar.recuperacao.service");

describe("AutenticacaoControllers - Cadastro", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { body: {}, headers: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(createUsuarioService as jest.Mock).mockReset();
	});

	it("deve criar usuário e retornar 201", async () => {
		req.body = {
			cpf: "12345678900",
			email: "user@test.com",
			nome_completo: "User Test",
			nome_usuario: "user.test",
			numero_registro: "123456",
			senha: "senha123",
		};
		const resposta = { id: "user123" };
		(createUsuarioService as jest.Mock).mockResolvedValue(resposta);

		await AutenticacaoControllers.Cadastro(
			req as Request,
			res as Response,
			next,
		);

		expect(createUsuarioService).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith(resposta);
		expect(next).not.toHaveBeenCalled();
	});

	it("deve chamar next quando cadastro falha", async () => {
		const error = { codigo: 400, erro: "Erro" };
		(createUsuarioService as jest.Mock).mockRejectedValue(error);

		await AutenticacaoControllers.Cadastro(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(error);
	});
});

describe("AutenticacaoControllers - Login", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { body: {}, headers: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(loginService as jest.Mock).mockReset();
	});
	it("deve realizar login e retornar 200", async () => {
		req.body = { nome_usuario: "user.test", senha: "senha123" };
		const resposta = { token: "abc" };
		(loginService as jest.Mock).mockResolvedValue(resposta);

		await AutenticacaoControllers.Login(req as Request, res as Response, next);

		expect(loginService).toHaveBeenCalledWith({
			nome_usuario: "user.test",
			senha: "senha123",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando login falha", async () => {
		const error = new Error("Login falhou");
		(loginService as jest.Mock).mockRejectedValue(error);

		await AutenticacaoControllers.Login(req as Request, res as Response, next);

		expect(next).toHaveBeenCalledWith(error);
	});
});

describe("AutenticacaoControllers - Visualizar Perfil", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { body: {}, headers: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();
	});

	it("deve visualizar perfil do usuário autenticado", async () => {
		req.user = { id: "user123" };
		const usuario = { nome_usuario: "user.test" };
		(findUsuarioService as jest.Mock).mockResolvedValue(usuario);

		await AutenticacaoControllers.VisualizarPerfil(
			req as any,
			res as Response,
			next,
		);

		expect(findUsuarioService).toHaveBeenCalledWith("user123");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(usuario);
	});
});

describe("AutenticacaoControllers - Atualizar Perfil", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { body: {}, headers: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(selfUpdateUsuarioService as jest.Mock).mockReset();
	});

	it("deve atualizar perfil e retornar 200", async () => {
		req.user = { id: "user123" };
		req.body = {
			nome_usuario: "user.test",
			email: "user@test.com",
			senha: "senha123",
			imagem_url: "url",
		};
		const resposta = { updated: true };
		(selfUpdateUsuarioService as jest.Mock).mockResolvedValue(resposta);

		await AutenticacaoControllers.AtualizarPerfil(
			req as any,
			res as Response,
			next,
		);

		expect(selfUpdateUsuarioService).toHaveBeenCalledWith("user123", {
			nome_usuario: "user.test",
			email: "user@test.com",
			senha: "senha123",
			imagem_url: "url",
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando atualizar perfil falha", async () => {
		req.user = { id: "user123" };
		(selfUpdateUsuarioService as jest.Mock).mockRejectedValue(
			new Error("Falha"),
		);

		await AutenticacaoControllers.AtualizarPerfil(
			req as any,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("AutenticacaoControllers - Esqueci Senha", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { body: {}, headers: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(esqueceuSenhaService as jest.Mock).mockReset();
	});

	it("deve enviar token de recuperação e retornar 200", async () => {
		req.body = { email: "user@test.com" };
		(esqueceuSenhaService as jest.Mock).mockResolvedValue(undefined);

		await AutenticacaoControllers.EsqueceuSenha(
			req as Request,
			res as Response,
			next,
		);

		expect(esqueceuSenhaService).toHaveBeenCalledWith("user@test.com");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(
			"Token de recuperação enviado para user@test.com",
		);
	});

	it("deve chamar next quando esqueceu senha falha", async () => {
		const error = new Error("Falha no envio");
		(esqueceuSenhaService as jest.Mock).mockRejectedValue(error);

		await AutenticacaoControllers.EsqueceuSenha(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(error);
	});
});

describe("AutenticacaoControllers - Verificar Token Recuperação", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { body: {}, headers: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(verificarTokenRecuperacaoService as jest.Mock).mockReset();
	});

	it("deve verificar token de recuperação e retornar 201", async () => {
		req.headers.authorization = "bearer_token";
		(verificarTokenRecuperacaoService as jest.Mock).mockResolvedValue(
			undefined,
		);

		await AutenticacaoControllers.VerificarTokenRecuperacao(
			req as Request,
			res as Response,
			next,
		);

		expect(verificarTokenRecuperacaoService).toHaveBeenCalledWith(
			"bearer_token",
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith();
	});

	it("deve chamar next quando verificar token de recuperação falha", async () => {
		const error = new Error("Token inválido");
		(verificarTokenRecuperacaoService as jest.Mock).mockRejectedValue(error);

		await AutenticacaoControllers.VerificarTokenRecuperacao(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(error);
	});
});

describe("AutenticacaoControllers - Recuperar Senha", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { body: {}, headers: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(recuperarSenhaService as jest.Mock).mockReset();
	});

	it("deve recuperar senha e retornar 200", async () => {
		req.headers.authorization = "bearer_token";
		req.body = { senha: "nova123" };
		(recuperarSenhaService as jest.Mock).mockResolvedValue(undefined);

		await AutenticacaoControllers.RecuperarSenha(
			req as Request,
			res as Response,
			next,
		);

		expect(recuperarSenhaService).toHaveBeenCalledWith(
			"bearer_token",
			"nova123",
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith("Senha alterada com sucesso");
	});

	it("deve chamar next quando recuperar senha falha", async () => {
		const error = new Error("Falha");
		(recuperarSenhaService as jest.Mock).mockRejectedValue(error);

		await AutenticacaoControllers.RecuperarSenha(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(error);
	});
});
