import { Request, Response, NextFunction } from "express";
import UsuariosControllers from "../../app/controllers/UsuariosControllers";
import createUsuarioService from "../../app/services/create.usuario.service";
import findUsuarioService from "../../app/services/find.usuario.service";
import listUsuariosService from "../../app/services/list.usuario.service";
import updateUsuarioService from "../../app/services/update.usuario.service";
import deleteUsuarioService from "../../app/services/delete.usuario.service";

jest.mock("../../app/services/create.usuario.service");
jest.mock("../../app/services/find.usuario.service");
jest.mock("../../app/services/list.usuario.service");
jest.mock("../../app/services/update.usuario.service");
jest.mock("../../app/services/delete.usuario.service");

describe("UsuariosControllers", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(findUsuarioService as jest.Mock).mockReset();
	});

	it("deve pegar usuário por id e retornar 200", async () => {
		req.params.id = "user123";
		const resposta = { nome_usuario: "user.test" };
		(findUsuarioService as jest.Mock).mockResolvedValue(resposta);

		await UsuariosControllers.PegarUsuarioPorId(
			req as Request,
			res as Response,
			next,
		);

		expect(findUsuarioService).toHaveBeenCalledWith("user123");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando pegar usuário por id falha", async () => {
		(findUsuarioService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await UsuariosControllers.PegarUsuarioPorId(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("UsuariosControllers - Listar Usuários", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {}, user: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(listUsuariosService as jest.Mock).mockReset();
	});

	it("deve listar usuários e retornar 200", async () => {
		req.query = { estado: "SP" };
		req.user = { id: "user123" };
		const resposta = { itens: [] };
		(listUsuariosService as jest.Mock).mockResolvedValue(resposta);

		await UsuariosControllers.ListarUsuarios(req as any, res as Response, next);

		expect(listUsuariosService).toHaveBeenCalledWith(req.query, "user123");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve enviar erro quando listar usuários falha", async () => {
		req.user = { id: "user123" };
		const error = { codigo: 500, erro: "Falha" };
		(listUsuariosService as jest.Mock).mockRejectedValue(error);

		await UsuariosControllers.ListarUsuarios(req as any, res as Response, next);

		expect(res.send).toHaveBeenCalledWith(error);
	});
});

describe("UsuariosControllers - Criar Usuário", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, body: {}, user: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(createUsuarioService as jest.Mock).mockReset();
	});

	it("deve criar usuário e retornar 201", async () => {
		req.user = { id: "criador123" };
		req.body = {
			cpf: "12345678900",
			email: "user@test.com",
			nome_completo: "User Test",
			nome_usuario: "user.test",
			numero_registro: "123456",
			senha: "senha123",
			dados_administrativos: {
				funcao: "USUARIO",
				entidade_relacionada: "entity123",
			},
		};
		const resposta = { id: "user123" };
		(createUsuarioService as jest.Mock).mockResolvedValue(resposta);

		await UsuariosControllers.CriarUsuario(req as any, res as Response, next);

		expect(createUsuarioService).toHaveBeenCalledWith(req.body, "criador123");
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando criar usuário falha", async () => {
		(createUsuarioService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await UsuariosControllers.CriarUsuario(req as any, res as Response, next);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("UsuariosControllers - Atualizar Usuário", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, body: {}, user: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(updateUsuarioService as jest.Mock).mockReset();
	});

	it("deve atualizar usuário e retornar 200", async () => {
		req.user = { id: "user123" };
		req.params.id = "alvo123";
		req.body = { nome_usuario: "novo.usuario" };
		const resposta = { id: "alvo123" };
		(updateUsuarioService as jest.Mock).mockResolvedValue(resposta);

		await UsuariosControllers.AtualizarUsuario(
			req as any,
			res as Response,
			next,
		);

		expect(updateUsuarioService).toHaveBeenCalledWith(
			"alvo123",
			req.body,
			"user123",
		);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando atualizar usuário falha", async () => {
		(updateUsuarioService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await UsuariosControllers.AtualizarUsuario(
			req as any,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("UsuariosControllers - Deletar Usuário", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, user: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(deleteUsuarioService as jest.Mock).mockReset();
	});

	it("deve remover usuário e retornar 204", async () => {
		req.user = { id: "user123" };
		req.params.id = "alvo123";
		(deleteUsuarioService as jest.Mock).mockResolvedValue(undefined);

		await UsuariosControllers.RemoverUsuário(req as any, res as Response, next);

		expect(deleteUsuarioService).toHaveBeenCalledWith("alvo123", "user123");
		expect(res.status).toHaveBeenCalledWith(204);
		expect(res.send).toHaveBeenCalledWith();
	});

	it("deve chamar next quando remover usuário falha", async () => {
		(deleteUsuarioService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await UsuariosControllers.RemoverUsuário(req as any, res as Response, next);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});
