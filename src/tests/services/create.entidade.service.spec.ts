import createEntidadeService from "../../app/services/create.entidade.service";
import EntidadeRepository from "../../app/repositories/Entidade.repository";

jest.mock("../../app/repositories/Entidade.repository");

describe("createEntidadeService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve criar entidade com sucesso", async () => {
		const entidadeData = {
			nome_entidade: "Ministério da Saúde",
			estado: "São Paulo",
			municipio: "São Paulo",
		};

		const entidadeMock = { ...entidadeData, _id: "123" };
		(EntidadeRepository.createEntidade as jest.Mock).mockResolvedValue({
			entidade: entidadeMock,
			erro: undefined,
		});

		const result = await createEntidadeService(entidadeData);

		expect(result).toEqual(entidadeMock);
		expect(EntidadeRepository.createEntidade).toHaveBeenCalledWith(entidadeData);
	});

	it("deve lançar erro quando repository retornar erro", async () => {
		const entidadeData = {
			nome_entidade: "Entidade Teste",
			estado: "SP",
			municipio: "São Paulo",
		};

		const erroMock = {
			codigo: 400,
			erro: "Erro de validação",
		};

		(EntidadeRepository.createEntidade as jest.Mock).mockResolvedValue({
			entidade: null,
			erro: erroMock,
		});

		await expect(createEntidadeService(entidadeData)).rejects.toEqual(erroMock);
	});
});