import { Request, Response, NextFunction } from "express";
import ErrorMiddleware from "../../app/middlewares/ErrorMiddleware";

describe("ErrorMiddleware", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();
	});

	it("deve enviar código e mensagem do erro recebido", async () => {
		const error = { codigo: 400, erro: "Requisição inválida" };

		await ErrorMiddleware(error as any, req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith("Requisição inválida");
	});

	it("deve enviar 500 quando o erro recebido não contém as propriedades esperadas", async () => {
		await ErrorMiddleware(undefined as any, req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.send).toHaveBeenCalledWith("Erro interno do servidor");
	});
});
