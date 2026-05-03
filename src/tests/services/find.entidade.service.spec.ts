import findEntidadeService from "../../app/services/find.entidade.service";
import EntidadeRepository from "../../app/repositories/Entidade.repository";

jest.mock("../../app/repositories/Entidade.repository");

describe("findEntidadeService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve encontrar entidade com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const entidadeMock = {
			_id: id,
			nome_entidade: "Entidade Teste",
			estado: "SP",
			municipio: "São Paulo",
			ativo: true,
		};

		(EntidadeRepository.findEntidadeId as jest.Mock).mockResolvedValue({
			entidade: entidadeMock,
			erro: undefined,
		});

		const result = await findEntidadeService(id);

		expect(result).toEqual(entidadeMock);
		expect(EntidadeRepository.findEntidadeId).toHaveBeenCalledWith(id);
	});

	it("deve lançar erro de database quando repository falhar", async () => {
		const id = "507f1f77bcf86cd799439013";
		const erroMock = {
			codigo: 500,
			erro: "Erro ao conectar com o banco de dados",
		};

		(EntidadeRepository.findEntidadeId as jest.Mock).mockResolvedValue({
			entidade: null,
			erro: erroMock,
		});

		await expect(findEntidadeService(id)).rejects.toEqual(erroMock);
	});
});
