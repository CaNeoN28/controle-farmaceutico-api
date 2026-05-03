import deleteFarmaciaService from "../../app/services/delete.farmacia.service";
import FarmaciaRepository from "../../app/repositories/Farmacia.repository";
import ImagemRepository from "../../app/repositories/Imagem.repository";
import { validarID } from "../../app/utils/validators";

jest.mock("../../app/repositories/Farmacia.repository");
jest.mock("../../app/repositories/Imagem.repository");
jest.mock("../../app/utils/validators");

describe("deleteFarmaciaService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(validarID as jest.Mock).mockReturnValue(true);
	});

	it("deve deletar farmacia com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const farmaciaMock = {
			_id: id,
			id: id,
			cnpj: "12.345.678/0001-90",
			nome_fantasia: "Farmácia Teste",
			imagem_url: undefined,
		};

		(FarmaciaRepository.deleteFarmacia as jest.Mock).mockResolvedValue({
			farmacia: farmaciaMock,
			erro: undefined,
		});

		await deleteFarmaciaService(id);

		expect(FarmaciaRepository.deleteFarmacia).toHaveBeenCalledWith(id);
		expect(ImagemRepository.removerImagem).not.toHaveBeenCalled();
	});

	it("deve deletar farmacia e remover imagem quando existir", async () => {
		const id = "507f1f77bcf86cd799439012";
		const farmaciaMock = {
			_id: id,
			id: id,
			cnpj: "12.345.678/0001-91",
			nome_fantasia: "Farmácia Com Imagem",
			imagem_url: "farmacia_123.jpg",
		};

		(FarmaciaRepository.deleteFarmacia as jest.Mock).mockResolvedValue({
			farmacia: farmaciaMock,
			erro: undefined,
		});

		await deleteFarmaciaService(id);

		expect(FarmaciaRepository.deleteFarmacia).toHaveBeenCalledWith(id);
		expect(ImagemRepository.removerImagem).toHaveBeenCalledWith(
			"farmacia",
			id,
			"farmacia_123.jpg",
		);
	});

	it("deve lançar erro quando repository retornar erro", async () => {
		const id = "507f1f77bcf86cd799439013";
		const erroMock = {
			codigo: 404,
			erro: "Farmácia não encontrada",
		};

		(FarmaciaRepository.deleteFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erro: erroMock,
		});

		await expect(deleteFarmaciaService(id)).rejects.toEqual({
			codigo: 404,
			erro: "Farmácia não encontrada",
		});
	});

	it("deve lançar erro quando id for inválido", async () => {
		const id = "invalid_id";
		(validarID as jest.Mock).mockReturnValue(false);

		await expect(deleteFarmaciaService(id)).rejects.toEqual({
			codigo: 400,
			erro: "Id inválido",
		});

		expect(FarmaciaRepository.deleteFarmacia).not.toHaveBeenCalled();
		expect(ImagemRepository.removerImagem).not.toHaveBeenCalled();
	});

	it("deve tentar remover imagem mesmo quando houver erro no repository", async () => {
		const id = "507f1f77bcf86cd799439014";
		const farmaciaMock = {
			_id: id,
			id: id,
			cnpj: "12.345.678/0001-92",
			nome_fantasia: "Farmácia Teste 2",
			imagem_url: "imagem.jpg",
		};

		(FarmaciaRepository.deleteFarmacia as jest.Mock).mockResolvedValue({
			farmacia: farmaciaMock,
			erro: undefined,
		});

		await deleteFarmaciaService(id);

		expect(ImagemRepository.removerImagem).toHaveBeenCalledWith(
			"farmacia",
			id,
			"imagem.jpg",
		);
	});
});
