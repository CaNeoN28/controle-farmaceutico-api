import PermitirExtensoesMiddleware from "../../../app/middlewares/files/PermitirExtensoesMiddleware";

describe("PermitirExtensoesMiddleware", () => {
	it("Deve permitir arquivos com extensões permitidas", async () => {
		const req: any = {
			arquivos: [{ name: "arquivo1.jpg" }, { name: "arquivo2.png" }],
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const next = jest.fn();

		const middleware = PermitirExtensoesMiddleware([".jpg", ".png"]);
		await middleware(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it("Deve rejeitar arquivos com extensões não permitidas", async () => {
		const req: any = {
			arquivos: [{ name: "arquivo1.jpg" }, { name: "arquivo2.exe" }],
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const next = jest.fn();

		const middleware = PermitirExtensoesMiddleware([".jpg", ".png"]);
		await middleware(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(422);
		expect(res.send).toHaveBeenCalledWith({
			mensagem:
				"Extensão inválida de arquivos, extensões permitidas: .jpg, .png",
			erros: {
				"arquivo2.exe": "Extensão inválida de arquivo",
			},
		});
	});
});
