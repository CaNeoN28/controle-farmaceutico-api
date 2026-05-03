import { Request, Response, NextFunction } from "express";
import ImagensControllers from "../../app/controllers/ImagensController";
import criarImagemService from "../../app/services/create.imagem.service";
import confirmarImagemService from "../../app/services/confirmar.imagem.service";
import deleteImagemService from "../../app/services/delete.imagem.service";

jest.mock("../../app/services/create.imagem.service");
jest.mock("../../app/services/confirmar.imagem.service");
jest.mock("../../app/services/delete.imagem.service");

describe("ImagensControllers- Criar Imagem", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, arquivos: [] };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(criarImagemService as jest.Mock).mockReset();
	});

	it("deve criar imagem e retornar 201", async () => {
		req.params.finalidade = "usuario";
		req.arquivos = [{ name: "file.jpg" }];
		const resposta = [{ url: "path" }];
		(criarImagemService as jest.Mock).mockResolvedValue(resposta);

		await ImagensControllers.CriarImagem(req as any, res as Response, next);

		expect(criarImagemService).toHaveBeenCalledWith(req.arquivos, "usuario");
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando criar imagem falha", async () => {
		(criarImagemService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await ImagensControllers.CriarImagem(req as any, res as Response, next);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("ImagensControllers - Confirmar Imagem", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, arquivos: [] };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(confirmarImagemService as jest.Mock).mockReset();
	});

	it("deve confirmar envio e retornar 201", async () => {
		req.params = { finalidade: "usuario", id_finalidade: "1", caminho: "path" };
		req.arquivos = [{ name: "file.jpg" }];
		(confirmarImagemService as jest.Mock).mockResolvedValue(undefined);

		await ImagensControllers.ConfirmarEnvio(req as any, res as Response, next);

		expect(confirmarImagemService).toHaveBeenCalledWith(
			"usuario",
			"1",
			"path",
			req.arquivos[0],
		);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith();
	});

	it("deve chamar next quando confirmar envio falha", async () => {
		(confirmarImagemService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await ImagensControllers.ConfirmarEnvio(req as any, res as Response, next);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("ImagensControllers - Deletar Imagem", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(deleteImagemService as jest.Mock).mockReset();
	});

	it("deve remover imagem e retornar 204", async () => {
		req.params = { finalidade: "usuario", id_finalidade: "1", caminho: "path" };
		(deleteImagemService as jest.Mock).mockResolvedValue(undefined);

		await ImagensControllers.RemoverImagem(req as any, res as Response, next);

		expect(deleteImagemService).toHaveBeenCalledWith("usuario", "1", "path");
		expect(res.status).toHaveBeenCalledWith(204);
		expect(res.send).toHaveBeenCalledWith();
	});

	it("deve chamar next quando remover imagem falha", async () => {
		(deleteImagemService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await ImagensControllers.RemoverImagem(req as any, res as Response, next);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});
