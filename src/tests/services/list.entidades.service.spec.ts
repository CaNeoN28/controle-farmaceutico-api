import listEntidadesService from "../../app/services/list.entidades.service";
import EntidadeRepository from "../../app/repositories/Entidade.repository";
import * as paginacaoUtils from "../../app/utils/paginacao";
import { FiltrosEntidade } from "../../types/Entidade";
import { PaginacaoQuery } from "../../types/Paginacao";

jest.mock("../../app/repositories/Entidade.repository");
jest.mock("../../app/utils/paginacao");

describe("listEntidadesService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve listar entidades com todos os filtros", async () => {
		const params: FiltrosEntidade & PaginacaoQuery = {
			estado: "SP",
			municipio: "São Paulo",
			nome_entidade: "Farmacia",
			ativo: "SIM",
			pagina: "1",
			limite: "10",
		};

		const entidadesMock = [
			{
				_id: "507f1f77bcf86cd799439011",
				nome_entidade: "Farmácia A",
				estado: "SP",
				municipio: "São Paulo",
				ativo: true,
			},
		];

		const responsaMock = {
			dados: entidadesMock,
			documentos_totais: 1,
			limite: 10,
			pagina: 1,
			paginas_totais: 1,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(EntidadeRepository.findEntidades as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listEntidadesService(params);

		expect(result).toEqual(responsaMock);
		expect(EntidadeRepository.findEntidades).toHaveBeenCalledWith(
			{
				ativo: true,
				estado: "SP",
				municipio: "São Paulo",
				nome_entidade: expect.any(RegExp)
			},
			{
				limite: 10,
				pagina: 1,
			},
		);
		expect(paginacaoUtils.extrairPaginacao).toHaveBeenCalledWith(params);
	});

	it("deve listar entidades com filtro ativo = NAO", async () => {
		const params: FiltrosEntidade & PaginacaoQuery = {
			ativo: "NAO",
			pagina: "1",
			limite: "10",
		};

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(EntidadeRepository.findEntidades as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listEntidadesService(params);

		expect(result).toEqual(responsaMock);
		expect(EntidadeRepository.findEntidades).toHaveBeenCalledWith(
			{
				ativo: false,
			},
			{
				limite: 10,
				pagina: 1,
			},
		);
	});

	it("deve listar entidades com filtro ativo = TODOS", async () => {
		const params: FiltrosEntidade & PaginacaoQuery = {
			ativo: "TODOS",
			pagina: "1",
			limite: "10",
		};

		const entidadesMock = [
			{
				_id: "507f1f77bcf86cd799439011",
				nome_entidade: "Farmácia A",
				estado: "SP",
				municipio: "São Paulo",
				ativo: true,
			},
			{
				_id: "507f1f77bcf86cd799439012",
				nome_entidade: "Farmácia B",
				estado: "RJ",
				municipio: "Rio de Janeiro",
				ativo: false,
			},
		];

		const responsaMock = {
			dados: entidadesMock,
			documentos_totais: 2,
			limite: 10,
			pagina: 1,
			paginas_totais: 1,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(EntidadeRepository.findEntidades as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listEntidadesService(params);

		expect(result).toEqual(responsaMock);
		expect(EntidadeRepository.findEntidades).toHaveBeenCalledWith(
			{
				ativo: { $in: [true, false] },
			},
			{
				limite: 10,
				pagina: 1,
			},
		);
	});

	it("deve aplicar filtro de nome_entidade com RegExp", async () => {
		const params: FiltrosEntidade & PaginacaoQuery = {
			nome_entidade: "farmacia",
			pagina: "1",
			limite: "10",
		};

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(EntidadeRepository.findEntidades as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listEntidadesService(params);

		const callArgs = (EntidadeRepository.findEntidades as jest.Mock).mock
			.calls[0][0];
		expect(callArgs.nome_entidade).toBeInstanceOf(RegExp);
	});

	it("deve usar valores de paginação padrão", async () => {
		const params = {};

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 10,
			pagina: 1,
			paginas_totais: 0,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: undefined,
			pagina: undefined,
		});

		(EntidadeRepository.findEntidades as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listEntidadesService(params);

		expect(result).toEqual(responsaMock);
	});

	it("deve propagar erro do repository", async () => {
		const params: FiltrosEntidade & PaginacaoQuery = {
			estado: "SP",
			pagina: "1",
			limite: "10",
		};

		const erroMock = {
			codigo: 500,
			erro: "Erro ao conectar com o banco de dados",
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(EntidadeRepository.findEntidades as jest.Mock).mockRejectedValue(erroMock);

		await expect(listEntidadesService(params)).rejects.toEqual(erroMock);
	});
});
