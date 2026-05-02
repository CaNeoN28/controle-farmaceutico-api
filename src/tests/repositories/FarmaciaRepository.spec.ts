import FarmaciaRepository from "../../app/repositories/Farmacia.repository";
import FarmaciaModel from "../../app/models/Farmacia";
import { erroParaDicionario } from "../../app/utils/mongooseErrors";

jest.mock("../../app/models/Farmacia", () => {
	const mock: any = jest.fn();
	mock.findById = jest.fn();
	mock.countDocuments = jest.fn();
	mock.find = jest.fn();
	return {
		__esModule: true,
		default: mock,
	};
});

jest.mock("../../app/utils/mongooseErrors", () => ({
	erroParaDicionario: jest.fn(),
}));

jest.mock("../../app/utils/paginacao", () => ({
	calcularPaginas: jest.fn(() => 1),
}));

type MockFarmaciaModelType = jest.Mock & {
	findById: jest.Mock;
	countDocuments: jest.Mock;
	find: jest.Mock;
};

const MockFarmaciaModel = FarmaciaModel as unknown as MockFarmaciaModelType;

const mockFarmaciaInstance = {
	save: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
	validateSync: jest.fn(),
};

describe("FarmaciaRepository - Encontrar ID da Farmacia", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockFarmaciaModel.mockImplementation(() => mockFarmaciaInstance);
	});

	it("deve retornar farmácia encontrada por id", async () => {
		MockFarmaciaModel.findById.mockResolvedValue({ _id: "id" });

		const result = await FarmaciaRepository.findFarmaciaId("id");

		expect(result).toEqual({ farmacia: { _id: "id" }, erro: undefined });
	});

	it("deve retornar erro 404 quando farmácia não for encontrada por id", async () => {
		MockFarmaciaModel.findById.mockResolvedValue(undefined);

		const result = await FarmaciaRepository.findFarmaciaId("id");

		expect(result).toEqual({
			farmacia: undefined,
			erro: { codigo: 404, erro: "Farmácia não encontrada" },
		});
	});
});

describe("FarmaciaRepository - Encontrar Farmacias", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockFarmaciaModel.mockImplementation(() => mockFarmaciaInstance);
	});

	it("deve listar farmácias com paginação", async () => {
		MockFarmaciaModel.countDocuments.mockResolvedValue(4);
		const query = {
			limit: jest.fn(),
			skip: jest.fn(),
		};
		query.limit.mockReturnValue(query);
		query.skip.mockResolvedValue(["farm1"]);
		MockFarmaciaModel.find.mockReturnValue(query);

		const result = await FarmaciaRepository.findFarmacias(
			{ estado: "SP" },
			{ limite: 2, pagina: 1 },
		);

		expect(result).toEqual({
			dados: ["farm1"],
			documentos_totais: 4,
			limite: 2,
			pagina: 1,
			paginas_totais: 1,
		});
	});
});

describe("FarmaciaRepository - Criar Farmacia", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockFarmaciaModel.mockImplementation(() => mockFarmaciaInstance);
		mockFarmaciaInstance.validateSync.mockResolvedValue(undefined);
	});

	it("deve criar farmácia quando validação estiver ok", async () => {
		mockFarmaciaInstance.validateSync = jest.fn().mockReturnValue(undefined);
		mockFarmaciaInstance.save.mockResolvedValue(undefined);

		const result = await FarmaciaRepository.createFarmacia({
			cnpj: "123",
			nome_fantasia: "Farmacia",
			endereco: {
				cep: "01001-000",
				estado: "SP",
				municipio: "Sao Paulo",
				bairro: "Centro",
				logradouro: "Rua X",
				numero: "1",
				localizacao: { x: "0", y: "0" },
			},
			horarios_servico: {},
		});

		expect(mockFarmaciaInstance.validateSync).toHaveBeenCalled();
		expect(mockFarmaciaInstance.save).toHaveBeenCalled();
		expect(result).toEqual({ farmacia: mockFarmaciaInstance, erro: undefined });
	});

	it("deve retornar erro de validação ao criar farmácia inválida", async () => {
		const validationError = {
			message: "validation failed",
			errors: { cnpj: { message: "Obrigatório" } },
		};
		mockFarmaciaInstance.validateSync = jest
			.fn()
			.mockReturnValue(validationError);
		(erroParaDicionario as jest.Mock).mockReturnValue({
			codigo: 400,
			erros: { cnpj: "Obrigatório" },
		});

		const result = await FarmaciaRepository.createFarmacia({
			cnpj: "",
			nome_fantasia: "",
			endereco: {
				cep: "",
				estado: "",
				municipio: "",
				bairro: "",
				logradouro: "",
				numero: "",
				localizacao: { x: "", y: "" },
			},
			horarios_servico: {},
		});

		expect(result).toEqual({
			farmacia: mockFarmaciaInstance,
			erro: { codigo: 400, erro: { cnpj: "Obrigatório" } },
		});
	});
});

describe("FarmaciaRepository - Atualizar Farmacia", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockFarmaciaModel.mockImplementation(() => mockFarmaciaInstance);
		mockFarmaciaInstance.validateSync.mockResolvedValue(undefined);
	});

	it("deve retornar erro 404 ao atualizar farmácia inexistente", async () => {
		MockFarmaciaModel.findById.mockResolvedValue(undefined);

		const result = await FarmaciaRepository.updateFarmacia("id", {
			nome_fantasia: "Novo",
		});

		expect(result).toEqual({
			farmacia: undefined,
			erros: { codigo: 404, erro: "Farmácia não encontrada" },
		});
	});

	it("deve atualizar farmácia com sucesso", async () => {
		const updatedFarmacia = { _id: "id", nome_fantasia: "Novo" };
		MockFarmaciaModel.findById
			.mockResolvedValueOnce(mockFarmaciaInstance)
			.mockResolvedValueOnce(updatedFarmacia);
		mockFarmaciaInstance.updateOne.mockResolvedValue(undefined);

		const result = await FarmaciaRepository.updateFarmacia("id", {
			nome_fantasia: "Novo",
		});

		expect(mockFarmaciaInstance.updateOne).toHaveBeenCalledWith(
			{ nome_fantasia: "Novo" },
			{ runValidators: true },
		);
		expect(result).toEqual({ farmacia: updatedFarmacia, erros: undefined });
	});

	it("deve retornar erro quando updateOne de farmácia falha", async () => {
		MockFarmaciaModel.findById.mockResolvedValue(mockFarmaciaInstance);
		mockFarmaciaInstance.updateOne.mockRejectedValue(new Error("Falha"));
		(erroParaDicionario as jest.Mock).mockReturnValue({
			codigo: 400,
			erros: { nome_fantasia: "Inválido" },
		});

		const result = await FarmaciaRepository.updateFarmacia("id", {
			nome_fantasia: "Novo",
		});

		expect(result).toEqual({
			farmacia: mockFarmaciaInstance,
			erros: { codigo: 400, erro: { nome_fantasia: "Inválido" } },
		});
	});
});

describe("FarmaciaRepository - Deletar Farmacia", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockFarmaciaModel.mockImplementation(() => mockFarmaciaInstance);
	});

	it("deve retornar erro 404 ao deletar farmácia inexistente", async () => {
		MockFarmaciaModel.findById.mockResolvedValue(undefined);

		const result = await FarmaciaRepository.deleteFarmacia("id");

		expect(result).toEqual({
			farmacia: undefined,
			erro: { codigo: 404, erro: "Farmácia não encontrada" },
		});
	});

	it("deve deletar farmácia com sucesso", async () => {
		MockFarmaciaModel.findById.mockResolvedValue(mockFarmaciaInstance);
		mockFarmaciaInstance.deleteOne.mockResolvedValue(undefined);

		const result = await FarmaciaRepository.deleteFarmacia("id");

		expect(mockFarmaciaInstance.deleteOne).toHaveBeenCalled();
		expect(result).toEqual({ farmacia: mockFarmaciaInstance, erro: undefined });
	});
});
