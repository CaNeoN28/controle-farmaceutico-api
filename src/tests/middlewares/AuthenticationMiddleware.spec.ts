import { Request, Response, NextFunction } from "express";
import AuthenticationMiddleware from "../../app/middlewares/AuthenticationMiddleware";
import findUsuarioService from "../../app/services/find.usuario.service";
import { verificarToken } from "../../app/utils/jwt";

jest.mock("../../app/services/find.usuario.service");
jest.mock("../../app/utils/jwt");

describe("AuthenticationMiddleware", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = {
			headers: {},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();
		(verificarToken as jest.Mock).mockReset();
		(findUsuarioService as jest.Mock).mockReset();
	});

	it("deve retornar 401 quando token não está presente", async () => {
		req.headers.authorization = undefined;

		await AuthenticationMiddleware(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.send).toHaveBeenCalledWith(
			"É necessário estar autenticado para usar esta rota"
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("deve retornar 401 quando token não começa com Bearer", async () => {
		req.headers.authorization = "InvalidToken";

		await AuthenticationMiddleware(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.send).toHaveBeenCalledWith(
			"É necessário estar autenticado para usar esta rota"
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("deve retornar 401 quando token é inválido", async () => {
		req.headers.authorization = "Bearer invalid_token";
		(verificarToken as jest.Mock).mockReturnValue(null);

		await AuthenticationMiddleware(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.send).toHaveBeenCalledWith(
			"É necessário estar autenticado para usar esta rota"
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("deve retornar 401 quando usuário não é encontrado", async () => {
		req.headers.authorization = "Bearer valid_token";
		(verificarToken as jest.Mock).mockReturnValue({ id: "user123" });
		(findUsuarioService as jest.Mock).mockRejectedValue(
			new Error("User not found")
		);

		await AuthenticationMiddleware(req as Request, res as Response, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.send).toHaveBeenCalledWith(
			"É necessário estar autenticado para usar esta rota"
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("deve chamar next quando autenticação é bem-sucedida", async () => {
		req.headers.authorization = "Bearer valid_token";
		const userData = { id: "user123", email: "user@test.com" };
		(verificarToken as jest.Mock).mockReturnValue(userData);
		(findUsuarioService as jest.Mock).mockResolvedValue({ _id: "user123" });

		await AuthenticationMiddleware(req as Request, res as Response, next);

		expect(req.user).toEqual(userData);
		expect(next).toHaveBeenCalled();
	});

	it("deve extrair token corretamente do header", async () => {
		req.headers.authorization = "Bearer my_token_here";
		(verificarToken as jest.Mock).mockReturnValue({ id: "user123" });
		(findUsuarioService as jest.Mock).mockResolvedValue({ _id: "user123" });

		await AuthenticationMiddleware(req as Request, res as Response, next);

		expect(verificarToken).toHaveBeenCalledWith("my_token_here");
	});
});
