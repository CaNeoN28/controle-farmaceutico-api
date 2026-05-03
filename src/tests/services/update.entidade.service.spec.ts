import updateEntidadeService from "../../app/services/update.entidade.service";
import EntidadeRepository from "../../app/repositories/Entidade.repository";

jest.mock("../../app/repositories/Entidade.repository");

describe("updateEntidadeService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve atualizar entidade com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const dataAtualizar = {
			nome_entidade: "Entidade Atualizada",
			estado: "RJ",
		};

		const entidadeMock = {
			_id: id,
			nome_entidade: "Entidade Atualizada",
			estado: "RJ",
			municipio: "Rio de Janeiro",
			ativo: true,
		};

		(EntidadeRepository.updateEntidade as jest.Mock).mockResolvedValue({
			entidade: entidadeMock,
			erro: undefined,
		});

		const result = await updateEntidadeService(id, dataAtualizar);

		expect(result).toEqual(entidadeMock);
		expect(EntidadeRepository.updateEntidade).toHaveBeenCalledWith(id, dataAtualizar);
	});

	it("deve lançar erro quando entidade não for encontrada", async () => {
		const id = "507f1f77bcf86cd799439012";
		const dataAtualizar = {
			nome_entidade: "Entidade Atualizada",
		};

		const erroMock = {
			codigo: 404,
			erro: "Entidade não encontrada",
		};

		(EntidadeRepository.updateEntidade as jest.Mock).mockResolvedValue({
			entidade: null,
			erro: erroMock,
		});

		await expect(updateEntidadeService(id, dataAtualizar)).rejects.toEqual(erroMock);
	});

	it("deve lançar erro quando id for inválido", async () => {
		const id = "invalid_id";
		const dataAtualizar = {
			nome_entidade: "Entidade Atualizada",
		};

		const erroMock = {
			codigo: 400,
			erro: "Id inválido",
		};

		(EntidadeRepository.updateEntidade as jest.Mock).mockResolvedValue({
			entidade: null,
			erro: erroMock,
		});

		await expect(updateEntidadeService(id, dataAtualizar)).rejects.toEqual(erroMock);
	});

	it("deve atualizar apenas campos permitidos", async () => {
		const id = "507f1f77bcf86cd799439013";
		const dataAtualizar = {
			nome_entidade: "Nova Entidade",
			estado: "MG",
			municipio: "Belo Horizonte",
		};

		const entidadeMock = {
			_id: id,
			...dataAtualizar,
			ativo: true,
		};

		(EntidadeRepository.updateEntidade as jest.Mock).mockResolvedValue({
			entidade: entidadeMock,
			erro: undefined,
		});

		const result = await updateEntidadeService(id, dataAtualizar);

		expect(result).toEqual(entidadeMock);
	});

	it("deve lançar erro de validação quando dados forem inválidos", async () => {
		const id = "507f1f77bcf86cd799439014";
		const dataAtualizar = {
			nome_entidade: "", 
		};

		const erroMock = {
			codigo: 400,
			erro: {
				nome_entidade: "Nome da entidade é obrigatório",
			},
		};

		(EntidadeRepository.updateEntidade as jest.Mock).mockResolvedValue({
			entidade: null,
			erro: erroMock,
		});

		await expect(updateEntidadeService(id, dataAtualizar)).rejects.toEqual(erroMock);
	});
});
