import deleteEntidadeService from "../../app/services/delete.entidade.service";
import EntidadeRepository from "../../app/repositories/Entidade.repository";

jest.mock("../../app/repositories/Entidade.repository");

describe("deleteEntidadeService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve deletar entidade com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const entidadeMock = {
			_id: id,
			nome_entidade: "Entidade Teste",
			ativo: true,
		};

		(EntidadeRepository.deleteEntidade as jest.Mock).mockResolvedValue({
			entidade: entidadeMock,
			erro: undefined,
		});

		const result = await deleteEntidadeService(id);

		expect(result).toEqual(entidadeMock);
		expect(EntidadeRepository.deleteEntidade).toHaveBeenCalledWith(id);
	});

	it("deve lançar erro quando repository retornar erro", async () => {
		const id = "507f1f77bcf86cd799439012";
		const erroMock = {
			codigo: 404,
			erro: "Entidade não encontrada",
		};

		(EntidadeRepository.deleteEntidade as jest.Mock).mockResolvedValue({
			entidade: null,
			erro: erroMock,
		});

		await expect(deleteEntidadeService(id)).rejects.toEqual(erroMock);
	});

	it("deve deletar entidade mesmo que ela não exista", async () => {
		const id = "507f1f77bcf86cd799439013";
		const erroMock = {
			codigo: 404,
			erro: {
				mensagem: "Entidade não encontrada",
			},
		};

		(EntidadeRepository.deleteEntidade as jest.Mock).mockResolvedValue({
			entidade: null,
			erro: erroMock,
		});

		await expect(deleteEntidadeService(id)).rejects.toEqual(erroMock);
	});
});
