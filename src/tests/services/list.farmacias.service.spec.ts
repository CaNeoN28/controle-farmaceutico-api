import listFarmaciasService from "../../app/services/list.farmacias.service";
import FarmaciaRepository from "../../app/repositories/Farmacia.repository";
import * as paginacaoUtils from "../../app/utils/paginacao";

jest.mock("../../app/repositories/Farmacia.repository");
jest.mock("../../app/utils/paginacao");

describe("listFarmaciasService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve listar farmacias com todos os filtros", async () => {
		const params = {
			bairro: "Centro",
			estado: "SP",
			municipio: "São Paulo",
			nome_fantasia: "Farmácia",
			pagina: 1,
			limite: 10,
		};

		const farmaciasMock = [
			{
				_id: "507f1f77bcf86cd799439011",
				nome_fantasia: "Farmácia Centro",
				endereco: {
					bairro: "Centro",
					estado: "SP",
					municipio: "São Paulo",
				},
			},
		];

		const responsaMock = {
			dados: farmaciasMock,
			documentos_totais: 1,
			limite: 10,
			pagina: 1,
			paginas_totais: 1,
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(FarmaciaRepository.findFarmacias as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listFarmaciasService(params);

		expect(result).toEqual(responsaMock);
		expect(FarmaciaRepository.findFarmacias).toHaveBeenCalled();
	});

	it("deve aplicar filtro de bairro com RegExp case-insensitive", async () => {
		const params = {
			bairro: "centro",
			pagina: 1,
			limite: 10,
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

		(FarmaciaRepository.findFarmacias as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listFarmaciasService(params);

		const callArgs = (FarmaciaRepository.findFarmacias as jest.Mock).mock
			.calls[0][0];
		expect(callArgs["endereco.bairro"]).toBeInstanceOf(RegExp);
		expect(callArgs["endereco.bairro"].flags).toContain("i");
	});

	it("deve aplicar filtro de estado com RegExp case-insensitive", async () => {
		const params = {
			estado: "sp",
			pagina: 1,
			limite: 10,
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

		(FarmaciaRepository.findFarmacias as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listFarmaciasService(params);

		const callArgs = (FarmaciaRepository.findFarmacias as jest.Mock).mock
			.calls[0][0];
		expect(callArgs["endereco.estado"]).toBeInstanceOf(RegExp);
		expect(callArgs["endereco.estado"].flags).toContain("i");
	});

	it("deve aplicar filtro de municipio com RegExp case-insensitive", async () => {
		const params = {
			municipio: "são paulo",
			pagina: 1,
			limite: 10,
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

		(FarmaciaRepository.findFarmacias as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listFarmaciasService(params);

		const callArgs = (FarmaciaRepository.findFarmacias as jest.Mock).mock
			.calls[0][0];
		expect(callArgs["endereco.municipio"]).toBeInstanceOf(RegExp);
		expect(callArgs["endereco.municipio"].flags).toContain("i");
	});

	it("deve aplicar filtro de nome_fantasia com RegExp case-insensitive", async () => {
		const params = {
			nome_fantasia: "farmacia",
			pagina: 1,
			limite: 10,
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

		(FarmaciaRepository.findFarmacias as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		await listFarmaciasService(params);

		const callArgs = (FarmaciaRepository.findFarmacias as jest.Mock).mock
			.calls[0][0];
		expect(callArgs.nome_fantasia).toBeInstanceOf(RegExp);
		expect(callArgs.nome_fantasia.flags).toContain("i");
	});

	it("deve usar valores de paginação padrão", async () => {
		const params = {
			bairro: "Centro",
		};

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

		(FarmaciaRepository.findFarmacias as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listFarmaciasService(params);

		expect(result).toEqual(responsaMock);
	});

	it("deve retornar lista vazia quando nenhuma farmacia corresponder", async () => {
		const params = {
			nome_fantasia: "Farmácia Inexistente",
			pagina: 1,
			limite: 10,
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

		(FarmaciaRepository.findFarmacias as jest.Mock).mockResolvedValue(
			responsaMock,
		);

		const result = await listFarmaciasService(params);

		expect(result.dados).toEqual([]);
		expect(result.documentos_totais).toBe(0);
	});

	it("deve propagar erro do repository", async () => {
		const params = {
			estado: "SP",
			pagina: 1,
			limite: 10,
		};

		const erroMock = {
			codigo: 500,
			erro: "Erro ao conectar com o banco de dados",
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		(FarmaciaRepository.findFarmacias as jest.Mock).mockRejectedValue(
			erroMock,
		);

		await expect(listFarmaciasService(params)).rejects.toEqual(erroMock);
	});
});
