import mongoose from "mongoose";
import EntidadeRepository from "../../app/repositories/Entidade.repository";
import EntidadeModel from "../../app/models/Entidade";
import { erroParaDicionario } from "../../app/utils/mongooseErrors";

jest.mock("../../app/models/Entidade", () => {
	const mock: any = jest.fn();
	mock.findOne = jest.fn();
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

type MockEntidadeModelType = jest.Mock & {
	findOne: jest.Mock;
	findById: jest.Mock;
	countDocuments: jest.Mock;
	find: jest.Mock;
};

const MockEntidadeModel = EntidadeModel as unknown as MockEntidadeModelType;

const mockEntidadeInstance = {
	validateSync: jest.fn(),
	save: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
};

describe("EntidadeRepository - Encontrar Entidade", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockEntidadeModel.mockImplementation(() => mockEntidadeInstance);
		mockEntidadeInstance.validateSync.mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("deve buscar entidade por filtros", async () => {
		MockEntidadeModel.findOne.mockResolvedValue({ nome_entidade: "Teste" });

		const result = await EntidadeRepository.findEntidade({
			nome_entidade: "Teste",
		});

		expect(MockEntidadeModel.findOne).toHaveBeenCalledWith({
			nome_entidade: "Teste",
		});
		expect(result).toEqual({ nome_entidade: "Teste" });
	});
});

describe("EntidadeRepository - Encontrar Entidade por ID", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockEntidadeModel.mockImplementation(() => mockEntidadeInstance);
		mockEntidadeInstance.validateSync.mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("deve retornar erro quando id de entidade for inválido", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(false);

		const result = await EntidadeRepository.findEntidadeId("invalid-id");

		expect(result).toEqual({
			entidade: undefined,
			erro: { codigo: 400, erro: "Id inválido" },
		});
	});

	it("deve retornar entidade quando id válido for encontrado", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(true);
		MockEntidadeModel.findById.mockResolvedValue({ _id: "id" });

		const result = await EntidadeRepository.findEntidadeId("valid-id");

		expect(MockEntidadeModel.findById).toHaveBeenCalledWith("valid-id");
		expect(result).toEqual({ entidade: { _id: "id" }, erro: undefined });
	});

	it("deve retornar erro 404 quando entidade por id não for encontrada", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(true);
		MockEntidadeModel.findById.mockResolvedValue(undefined);

		const result = await EntidadeRepository.findEntidadeId("valid-id");

		expect(result).toEqual({
			entidade: undefined,
			erro: { codigo: 404, erro: "Entidade não encontrada" },
		});
	});
});

describe("EntidadeRepository - Listar Entidades", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockEntidadeModel.mockImplementation(() => mockEntidadeInstance);
		mockEntidadeInstance.validateSync.mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("deve listar entidades com paginação", async () => {
		MockEntidadeModel.countDocuments.mockResolvedValue(5);
		MockEntidadeModel.find.mockReturnValue({
			limit: jest.fn().mockReturnThis(),
			skip: jest.fn().mockResolvedValue(["ent1", "ent2"]),
		});

		const result = await EntidadeRepository.findEntidades(
			{ ativo: true },
			{ limite: 2, pagina: 2 },
		);

		expect(MockEntidadeModel.countDocuments).toHaveBeenCalledWith({
			ativo: true,
		});
		expect(result).toEqual({
			dados: ["ent1", "ent2"],
			documentos_totais: 5,
			limite: 2,
			pagina: 2,
			paginas_totais: 1,
		});
	});
});

describe("EntidadeRepository - Criar Entidade", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockEntidadeModel.mockImplementation(() => mockEntidadeInstance);
		mockEntidadeInstance.validateSync.mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("deve criar entidade quando validação estiver ok", async () => {
		mockEntidadeInstance.validateSync.mockReturnValue(undefined);
		mockEntidadeInstance.save.mockResolvedValue(undefined);

		const result = await EntidadeRepository.createEntidade({
			nome_entidade: "Teste",
			estado: "SP",
			municipio: "Vilhena",
		});

		expect(mockEntidadeInstance.validateSync).toHaveBeenCalled();
		expect(mockEntidadeInstance.save).toHaveBeenCalled();
		expect(result).toEqual({ entidade: mockEntidadeInstance, erro: undefined });
	});

	it("deve retornar erro de validação ao criar entidade inválida", async () => {
		const validationError = {
			message: "validation failed",
			errors: { nome_entidade: { message: "Obrigatório" } },
		};
		mockEntidadeInstance.validateSync.mockReturnValue(validationError);
		(erroParaDicionario as jest.Mock).mockReturnValue({
			codigo: 400,
			erros: { nome_entidade: "Obrigatório" },
		});

		const result = await EntidadeRepository.createEntidade({
			nome_entidade: "",
			estado: "SP",
			municipio: "Vilhena",
		});

		expect(result).toEqual({
			entidade: mockEntidadeInstance,
			erro: { codigo: 400, erro: { nome_entidade: "Obrigatório" } },
		});
	});
});

describe("EntidadeRepository - Atualizar Entidade", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockEntidadeModel.mockImplementation(() => mockEntidadeInstance);
		mockEntidadeInstance.validateSync.mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("deve retornar erro 404 ao atualizar entidade não encontrada", async () => {
		MockEntidadeModel.findById.mockResolvedValue(undefined);

		const result = await EntidadeRepository.updateEntidade("id", {
			municipio: "Novo",
		});

		expect(result).toEqual({
			entidade: undefined,
			erro: { codigo: 404, erro: "Entidade não encontrada" },
		});
	});

	it("deve atualizar entidade com sucesso", async () => {
		const updatedEntity = { _id: "id", municipio: "Novo" };
		MockEntidadeModel.findById
			.mockResolvedValueOnce(mockEntidadeInstance)
			.mockResolvedValueOnce(updatedEntity);
		mockEntidadeInstance.updateOne.mockResolvedValue(undefined);
		mockEntidadeInstance.save.mockResolvedValue(undefined);

		const result = await EntidadeRepository.updateEntidade("id", {
			municipio: "Novo",
		});

		expect(mockEntidadeInstance.updateOne).toHaveBeenCalledWith(
			{ municipio: "Novo" },
			{ new: true, runValidators: true },
		);
		expect(MockEntidadeModel.findById).toHaveBeenCalledTimes(2);
		expect(result).toEqual({ entidade: updatedEntity, erro: undefined });
	});

	it("deve retornar erro quando updateOne lançar exceção", async () => {
		const updateError = new Error("Falha");
		MockEntidadeModel.findById.mockResolvedValue(mockEntidadeInstance);
		mockEntidadeInstance.updateOne.mockRejectedValue(updateError);
		(erroParaDicionario as jest.Mock).mockReturnValue({
			codigo: 400,
			erros: { municipio: "Inválido" },
		});

		const result = await EntidadeRepository.updateEntidade("id", {
			municipio: "Novo",
		});

		expect(result).toEqual({
			entidade: mockEntidadeInstance,
			erro: { codigo: 400, erro: { municipio: "Inválido" } },
		});
	});
});

describe("EntidadeRepository - Deletar Entidade", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		MockEntidadeModel.mockImplementation(() => mockEntidadeInstance);
		mockEntidadeInstance.validateSync.mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("deve retornar erro 400 ao deletar entidade com id inválido", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(false);

		const result = await EntidadeRepository.deleteEntidade("invalid-id");

		expect(result).toEqual({
			entidade: undefined,
			erro: { codigo: 400, erro: "Id inválido" },
		});
	});

	it("deve retornar erro 404 ao deletar entidade inexistente", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(true);
		MockEntidadeModel.findById.mockResolvedValue(undefined);

		const result = await EntidadeRepository.deleteEntidade("valid-id");

		expect(result).toEqual({
			entidade: undefined,
			erro: { codigo: 404, erro: "Entidade não encontrada" },
		});
	});

	it("deve deletar entidade com sucesso", async () => {
		jest.spyOn(mongoose, "isValidObjectId").mockReturnValue(true);
		MockEntidadeModel.findById.mockResolvedValue(mockEntidadeInstance);
		mockEntidadeInstance.deleteOne.mockResolvedValue(undefined);

		const result = await EntidadeRepository.deleteEntidade("valid-id");

		expect(mockEntidadeInstance.deleteOne).toHaveBeenCalled();
		expect(result).toEqual({ entidade: mockEntidadeInstance, erro: undefined });
	});
});
