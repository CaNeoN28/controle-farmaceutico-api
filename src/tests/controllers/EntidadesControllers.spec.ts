import { Request, Response, NextFunction } from "express";
import EntidadesControllers from "../../app/controllers/EntidadesControllers";
import createEntidadeService from "../../app/services/create.entidade.service";
import findEntidadeService from "../../app/services/find.entidade.service";
import listEntidadesService from "../../app/services/list.entidades.service";
import updateEntidadeService from "../../app/services/update.entidade.service";
import deleteEntidadeService from "../../app/services/delete.entidade.service";

jest.mock("../../app/services/create.entidade.service");
jest.mock("../../app/services/find.entidade.service");
jest.mock("../../app/services/list.entidades.service");
jest.mock("../../app/services/update.entidade.service");
jest.mock("../../app/services/delete.entidade.service");

describe("EntidadesControllers - Encontrar Entidade Por Id", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {}, body: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(findEntidadeService as jest.Mock).mockReset();
	});

	it("deve encontrar entidade por id e retornar 200", async () => {
		req.params.id = "entidade123";
		const entidade = { nome_entidade: "Farmacia" };
		(findEntidadeService as jest.Mock).mockResolvedValue(entidade);

		await EntidadesControllers.EncontrarEntidadePorId(
			req as Request,
			res as Response,
			next,
		);

		expect(findEntidadeService).toHaveBeenCalledWith("entidade123");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(entidade);
	});

	it("deve chamar next quando encontrar entidade falha", async () => {
		const error = new Error("Não encontrado");
		(findEntidadeService as jest.Mock).mockRejectedValue(error);

		await EntidadesControllers.EncontrarEntidadePorId(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(error);
	});
});

describe("EntidadesControllers - Listar Entidades", () => {
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

		(listEntidadesService as jest.Mock).mockReset();
	});

	it("deve listar entidades e retornar 200", async () => {
		req.query = {
			estado: "SP",
			municipio: "Sao Paulo",
			nome_entidade: "Teste",
			ativo: true,
			limite: 10,
			pagina: 1,
		};
		const resposta = { itens: [] };
		(listEntidadesService as jest.Mock).mockResolvedValue(resposta);

		await EntidadesControllers.ListarEntidades(
			req as Request,
			res as Response,
			next,
		);

		expect(listEntidadesService).toHaveBeenCalledWith({
			ativo: true,
			estado: "SP",
			municipio: "Sao Paulo",
			nome_entidade: "Teste",
			limite: 10,
			pagina: 1,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando listar entidades falha", async () => {
		const error = new Error("Falha");
		(listEntidadesService as jest.Mock).mockRejectedValue(error);

		await EntidadesControllers.ListarEntidades(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(error);
	});
});

describe("EntidadesControllers - Criar Entidade", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {}, body: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(createEntidadeService as jest.Mock).mockReset();
	});

	it("deve criar entidade e retornar 201", async () => {
		req.body = { estado: "SP", municipio: "Sao Paulo", nome_entidade: "Teste" };
		const resposta = { id: "entidade123" };
		(createEntidadeService as jest.Mock).mockResolvedValue(resposta);

		await EntidadesControllers.CriarEntidade(
			req as Request,
			res as Response,
			next,
		);

		expect(createEntidadeService).toHaveBeenCalledWith({
			estado: "SP",
			municipio: "Sao Paulo",
			nome_entidade: "Teste",
		});
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando criar entidade falha", async () => {
		(createEntidadeService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await EntidadesControllers.CriarEntidade(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("EntidadesControllers - Atualizar Entidade", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {}, body: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(updateEntidadeService as jest.Mock).mockReset();
	});

	it("deve atualizar entidade e retornar 200", async () => {
		req.params.id = "entidade123";
		req.body = {
			estado: "SP",
			municipio: "Sao Paulo",
			nome_entidade: "Teste Atualizado",
			ativo: true,
		};
		const resposta = { id: "entidade123" };
		(updateEntidadeService as jest.Mock).mockResolvedValue(resposta);

		await EntidadesControllers.AtualizarEntidade(
			req as Request,
			res as Response,
			next,
		);

		expect(updateEntidadeService).toHaveBeenCalledWith("entidade123", {
			estado: "SP",
			municipio: "Sao Paulo",
			nome_entidade: "Teste Atualizado",
			ativo: true,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando atualizar entidade falha", async () => {
		(updateEntidadeService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await EntidadesControllers.AtualizarEntidade(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("EntidadesControllers - Remover Entidade", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {}, body: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(deleteEntidadeService as jest.Mock).mockReset();
	});

	it("deve remover entidade e retornar 204", async () => {
		req.params.id = "entidade123";
		(deleteEntidadeService as jest.Mock).mockResolvedValue(undefined);

		await EntidadesControllers.RemoverEntidade(
			req as Request,
			res as Response,
			next,
		);

		expect(deleteEntidadeService).toHaveBeenCalledWith("entidade123");
		expect(res.status).toHaveBeenCalledWith(204);
		expect(res.send).toHaveBeenCalledWith();
	});

	it("deve chamar next quando remover entidade falha", async () => {
		(deleteEntidadeService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await EntidadesControllers.RemoverEntidade(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});
