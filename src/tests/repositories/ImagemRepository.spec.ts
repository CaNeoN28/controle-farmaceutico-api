import mongoose from "mongoose";
import ImagemRepository from "../../app/repositories/Imagem.repository";
import ImagemModel from "../../app/models/Imagem";
import FarmaciaRepository from "../../app/repositories/Farmacia.repository";
import UsuarioRepository from "../../app/repositories/Usuario.repository";

jest.mock("../../app/models/Imagem", () => {
	const mock: any = jest.fn();
	mock.findOne = jest.fn();
	return {
		__esModule: true,
		default: mock,
	};
});

jest.mock("../../app/repositories/Farmacia.repository", () => ({
	findFarmaciaId: jest.fn(),
}));

jest.mock("../../app/repositories/Usuario.repository", () => ({
	findUsuarioId: jest.fn(),
}));

type MockImagemModelType = jest.Mock & {
	findOne: jest.Mock;
};

const MockImagemModel = ImagemModel as unknown as MockImagemModelType;

const mockImagemInstance = {
	updateOne: jest.fn(),
	save: jest.fn(),
	deleteOne: jest.fn(),
};

describe("ImagemRepository - Criar Imagem", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockImagemModel.mockImplementation(() => mockImagemInstance);
	});

	it("deve atualizar imagem existente quando há uma imagem não utilizada", async () => {
		const existingImage = { updateOne: jest.fn().mockResolvedValue(undefined) };
		MockImagemModel.findOne.mockResolvedValue(existingImage);

		await ImagemRepository.criarImagem("usuario", "arquivo.jpg");

		expect(existingImage.updateOne).toHaveBeenCalledWith({
			caminho_imagem: "arquivo.jpg",
			confirmacao_expira: expect.any(Date),
			finalidade: "usuario",
		});
		expect(mockImagemInstance.save).not.toHaveBeenCalled();
	});

	it("deve criar nova imagem quando não há imagem não utilizada", async () => {
		MockImagemModel.findOne.mockResolvedValue(undefined);
		mockImagemInstance.save.mockResolvedValue(undefined);

		await ImagemRepository.criarImagem("farmacia", "arquivo.jpg");

		expect(MockImagemModel).toHaveBeenCalledWith({
			caminho_imagem: "arquivo.jpg",
			confirmacao_expira: expect.any(Date),
			finalidade: "farmacia",
		});
		expect(mockImagemInstance.save).toHaveBeenCalled();
	});
});

describe("ImagemRepository - Confirmar Imagem", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockImagemModel.mockImplementation(() => mockImagemInstance);
	});

	it("deve retornar erro quando id_finalidade for inválido ao confirmar imagem", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(false);
		(FarmaciaRepository.findFarmaciaId as jest.Mock).mockResolvedValue({
			farmacia: { imagem_url: "arquivo.jpg" },
		});
		MockImagemModel.findOne
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce(mockImagemInstance);
		mockImagemInstance.updateOne.mockResolvedValue(undefined);
		mockImagemInstance.save.mockResolvedValue(undefined);

		const result = await ImagemRepository.confirmarImagem(
			"farmacia",
			"invalid-id",
			"arquivo.jpg",
		);

		expect(result).toEqual({
			imagem: mockImagemInstance,
			erro: { codigo: 400, erro: "id_finalidade é inválido" },
		});
	});

	it("deve retornar erro quando não encontrar o alvo para confirmação de imagem", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(true);
		(FarmaciaRepository.findFarmaciaId as jest.Mock).mockResolvedValue({
			farmacia: undefined,
		});

		const result = await ImagemRepository.confirmarImagem(
			"farmacia",
			"valid-id",
			"arquivo.jpg",
		);

		expect(result).toEqual({
			imagem: undefined,
			erro: { codigo: 400, erro: "Não foi possível salvar imagem" },
		});
	});

	it("deve retornar erro quando imagem existente com mesmo caminho já foi confirmada", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(true);
		(FarmaciaRepository.findFarmaciaId as jest.Mock).mockResolvedValue({
			farmacia: { imagem_url: "arquivo.jpg" },
		});
		MockImagemModel.findOne.mockResolvedValueOnce({});

		const result = await ImagemRepository.confirmarImagem(
			"farmacia",
			"valid-id",
			"arquivo.jpg",
		);

		expect(result).toEqual({
			imagem: undefined,
			erro: { codigo: 400, erro: "Não foi possível salvar imagem" },
		});
	});

	it("deve confirmar imagem e salvar com sucesso", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(true);
		(FarmaciaRepository.findFarmaciaId as jest.Mock).mockResolvedValue({
			farmacia: { imagem_url: "arquivo.jpg" },
		});
		const imagem = {
			updateOne: jest.fn().mockResolvedValue(undefined),
			save: jest.fn().mockResolvedValue(undefined),
		};
		MockImagemModel.findOne
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce(imagem);

		const result = await ImagemRepository.confirmarImagem(
			"farmacia",
			"valid-id",
			"arquivo.jpg",
		);

		expect(MockImagemModel.findOne).toHaveBeenCalledTimes(2);
		expect(imagem.updateOne).toHaveBeenCalledWith({
			id_finalidade: "valid-id",
			confirmacao_expira: null,
		});
		expect(imagem.save).toHaveBeenCalled();
		expect(result).toEqual({ imagem, erro: undefined });
	});
});

describe("ImagemRepository - Deletar Imagem", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockImagemModel.mockImplementation(() => mockImagemInstance);
	});

	it("deve remover imagem quando encontrada", async () => {
		const imagemEncontrada = {
			deleteOne: jest.fn().mockResolvedValue(undefined),
		};
		MockImagemModel.findOne.mockResolvedValue(imagemEncontrada);

		await ImagemRepository.removerImagem("farmacia", "valid-id", "arquivo.jpg");

		expect(imagemEncontrada.deleteOne).toHaveBeenCalled();
	});

	it("não deve falhar ao remover imagem quando não encontrada", async () => {
		MockImagemModel.findOne.mockResolvedValue(undefined);

		await ImagemRepository.removerImagem("farmacia", "valid-id", "arquivo.jpg");

		expect(MockImagemModel.findOne).toHaveBeenCalledWith({
			finalidade: "farmacia",
			id_finalidade: "valid-id",
			caminho_imagem: "arquivo.jpg",
		});
	});
});
