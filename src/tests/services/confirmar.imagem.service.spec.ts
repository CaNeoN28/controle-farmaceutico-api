import confirmarImagemService from "../../app/services/confirmar.imagem.service";
import ImagemRepository from "../../app/repositories/Imagem.repository";

jest.mock("../../app/repositories/Imagem.repository");

describe("confirmarImagemService", () => {
	let arquivo: any;

	beforeEach(() => {
		jest.clearAllMocks();
		arquivo = {
			mv: jest.fn((dest: string, cb: (err: Error | null) => void) => cb(null)),
		};
	});

	it("deve lançar erro quando ImagemRepository retornar erro", async () => {
		(ImagemRepository.confirmarImagem as jest.Mock).mockResolvedValue({ imagem: null, erro: { codigo: 400, erro: "Erro de confirmação" } });

		await expect(
			confirmarImagemService("farmacia", "id", "arquivo.jpg", arquivo),
		).rejects.toEqual({ codigo: 400, erro: "Erro de confirmação" });
	});

	it("deve lançar erro 404 quando imagem não existir", async () => {
		(ImagemRepository.confirmarImagem as jest.Mock).mockResolvedValue({ imagem: undefined, erro: undefined });

		await expect(
			confirmarImagemService("farmacia", "id", "arquivo.jpg", arquivo),
		).rejects.toEqual({ codigo: 404, erro: "Imagem não encontrada" });
	});

	it("deve mover o arquivo quando a confirmação for bem-sucedida", async () => {
		const imagem = { caminho_imagem: "arquivo.jpg" };
		(ImagemRepository.confirmarImagem as jest.Mock).mockResolvedValue({ imagem, erro: undefined });

		await expect(
			confirmarImagemService("farmacia", "id", "arquivo.jpg", arquivo),
		).resolves.toBeUndefined();

		expect(arquivo.mv).toHaveBeenCalledWith(expect.stringContaining("files/imagens/arquivo.jpg"), expect.any(Function));
	});

	it("deve lançar erro 500 quando mv falhar", async () => {
		arquivo.mv = jest.fn((dest: string, cb: (err: Error | null) => void) => cb(new Error("Falha")));
		(ImagemRepository.confirmarImagem as jest.Mock).mockResolvedValue({ imagem: { caminho_imagem: "arquivo.jpg" }, erro: undefined });

		await expect(
			confirmarImagemService("farmacia", "id", "arquivo.jpg", arquivo),
		).rejects.toEqual({ codigo: 500, erro: "Não foi possível salvar imagem" });
	});
});
