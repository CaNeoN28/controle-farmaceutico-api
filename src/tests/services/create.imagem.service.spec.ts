import criarImagemService from "../../app/services/create.imagem.service";
import ImagemRepository from "../../app/repositories/Imagem.repository";
import { v4 as uuidv4 } from "uuid";

jest.mock("../../app/repositories/Imagem.repository");
jest.mock("uuid", () => ({ v4: jest.fn(() => "unique-uuid") }));

describe("criarImagemService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(ImagemRepository.criarImagem as jest.Mock).mockResolvedValue(undefined);
	});

	it("deve lançar erro quando finalidade não for informada", async () => {
		await expect(criarImagemService([], undefined)).rejects.toEqual({
			codigo: 400,
			erro: "Finalidade é obrigatório",
		});
	});

	it("deve retornar relação de arquivos e criar imagens para cada arquivo", async () => {
		const arquivos = [{ name: "file1.jpg" }, { name: "file2.png" }];

		const result = await criarImagemService(arquivos as any, "usuario");
		await new Promise((resolve) => setImmediate(resolve));

		expect(result).toEqual({
			"file1.jpg": "unique-uuid.jpg",
			"file2.png": "unique-uuid.png",
		});
		expect(ImagemRepository.criarImagem).toHaveBeenCalledTimes(2);
		expect(ImagemRepository.criarImagem).toHaveBeenNthCalledWith(1, "usuario", "unique-uuid.jpg");
		expect(ImagemRepository.criarImagem).toHaveBeenNthCalledWith(2, "usuario", "unique-uuid.png");
	});
});
