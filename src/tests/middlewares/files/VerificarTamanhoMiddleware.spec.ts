import VerificarTamanhoMiddleware from "../../../app/middlewares/files/VerificarTamanhoMiddleware";

describe("VerificarTamanhoMiddleware", () => {
	it("deve passar para o próximo middleware quando os arquivos estiverem dentro do limite", async () => {
		const req: any = {
			arquivos: [
				{ name: "arquivo1.jpg", size: 1024 * 1024 * 2 },
				{ name: "arquivo2.png", size: 1024 * 1024 * 3 },
			],
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const next = jest.fn();

		await VerificarTamanhoMiddleware(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
		expect(res.send).not.toHaveBeenCalled();
	});

	it("deve retornar erro quando houver arquivos acima do limite", async () => {
		const req: any = {
			arquivos: [
				{ name: "arquivo1.jpg", size: 1024 * 1024 * 6 },
				{ name: "arquivo2.png", size: 1024 * 1024 * 3 },
			],
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		const next = jest.fn();

		await VerificarTamanhoMiddleware(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({
			mensagem: "Arquivos acima do limite de envio",
			erros: {
				"arquivo1.jpg": "Arquivo acima do limite permitido de 5mb",
			},
		});
	});
});
