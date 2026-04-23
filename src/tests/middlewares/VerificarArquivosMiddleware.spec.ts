import VerificarArquivosMiddleware from "../../app/middlewares/files/VerificarArquivosMiddleware";

describe("VerificarArquivosMiddleware", () => {
	it("deve passar para o próximo middleware quando arquivos estiverem presentes", async () => {
		const req: any = {
			files: {
				meusArquivos: [{ name: "arquivo1.jpg" }, { name: "arquivo2.png" }],
			},
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const next = jest.fn();

		const middleware = VerificarArquivosMiddleware("meusArquivos");
		await middleware(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(req.arquivos).toEqual([
			{ name: "arquivo1.jpg" },
			{ name: "arquivo2.png" },
		]);
	});

	it("deve retornar erro quando nenhum arquivo for enviado", async () => {
		const req: any = {};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const next = jest.fn();

		const middleware = VerificarArquivosMiddleware("meusArquivos");
		await middleware(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith(
			"É necessário o envio de pelo menos um arquivo",
		);
	});

	it("deve retornar erro quando nenhum arquivo for encontrado para a chave especificada", async () => {
		const req: any = {
			files: {
				outrosArquivos: [{ name: "arquivo1.jpg" }],
			},
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const next = jest.fn();

		const middleware = VerificarArquivosMiddleware("meusArquivos");
		await middleware(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith(
			`Nenhum arquivo encontrado para "meusArquivos"`,
		);
	});
});
