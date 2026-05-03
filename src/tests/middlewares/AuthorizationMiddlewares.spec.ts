import { Request, Response, NextFunction } from "express";
import { AutorizarGerente } from "../../app/middlewares/AuthorizationMiddlewares";
import findUsuarioService from "../../app/services/find.usuario.service";

jest.mock("../../app/services/find.usuario.service");

describe("AutorizarGerente", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = {
			user: {
				id: "user123",
			},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();
		(findUsuarioService as jest.Mock).mockReset();
	});

	it("deve chamar next quando o usuário é gerente ou superior", async () => {
		(findUsuarioService as jest.Mock).mockResolvedValue({
			dados_administrativos: { funcao: "GERENTE" },
		});

		await AutorizarGerente(req as Request, res as Response, next);

		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
	});

	it("deve retornar 403 quando o usuário não tem permissão suficiente", async () => {
		(findUsuarioService as jest.Mock).mockResolvedValue({
			dados_administrativos: { funcao: "USUARIO" },
		});

		await AutorizarGerente(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.send).toHaveBeenCalledWith(
			"É necessário ser gerente ou superior para realizar esta ação"
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("deve repassar o erro quando a busca de usuário falha", async () => {
		const error = { codigo: 404, erro: "Usuário não encontrado" };
		(findUsuarioService as jest.Mock).mockRejectedValue(error);

		await expect(
			AutorizarGerente(req as Request, res as Response, next)
		).rejects.toEqual(error);

		expect(next).not.toHaveBeenCalled();
	});
});
