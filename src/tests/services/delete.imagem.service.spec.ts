import deleteImagemService from "../../app/services/delete.imagem.service";
import ImagemRepository from "../../app/repositories/Imagem.repository";
import fileSystem from "fs";

jest.mock("../../app/repositories/Imagem.repository");

describe("deleteImagemService", () => {
	let unlinkMock: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		(ImagemRepository.removerImagem as jest.Mock).mockResolvedValue(undefined);
		unlinkMock = jest.spyOn(fileSystem, "unlink").mockImplementation(() => undefined);
	});

	afterEach(() => {
		unlinkMock.mockRestore();
	});

	it("deve remover a imagem e chamar unlink", async () => {
		unlinkMock.mockImplementation((path, cb) => cb(null));

		await expect(deleteImagemService("farmacia", "id", "arquivo.jpg")).resolves.toBeUndefined();

		expect(ImagemRepository.removerImagem).toHaveBeenCalledWith("farmacia", "id", "arquivo.jpg");
		expect(unlinkMock).toHaveBeenCalledWith("files/imagens/arquivo.jpg", expect.any(Function));
	});

	it("deve lançar erro 404 quando unlink retornar ENOENT", async () => {
		unlinkMock.mockImplementation((path, cb) => cb({ code: "ENOENT" }));

		await expect(deleteImagemService("farmacia", "id", "arquivo.jpg")).rejects.toEqual({
			codigo: 404,
			erro: "Imagem não encontrada",
		});
	});

	it("deve lançar erro 500 quando unlink retornar outro erro", async () => {
		unlinkMock.mockImplementation((path, cb) => cb({ code: "EACCES" }));

		await expect(deleteImagemService("farmacia", "id", "arquivo.jpg")).rejects.toEqual({
			codigo: 500,
			erro: "Não foi possível remover a imagem",
		});
	});
});
