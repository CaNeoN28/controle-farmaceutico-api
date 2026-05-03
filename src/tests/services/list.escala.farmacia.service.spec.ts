import listPorEscalaFarmaciaService from "../../app/services/list.escala.farmacia.service";
import FarmaciaRepository from "../../app/repositories/Farmacia.repository";
import * as paginacaoUtils from "../../app/utils/paginacao";

jest.mock("../../app/repositories/Farmacia.repository");
jest.mock("../../app/utils/paginacao");

describe("listPorEscalaFarmaciaService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve listar farmacias por escala com sucesso", async () => {
		const agora = new Date();
		agora.setMilliseconds(0)
		const amanha = new Date(agora);

		amanha.setDate(amanha.getDate() + 1);

		const params = {
			estado: "SP",
			municipio: "São Paulo",
			tempo: agora.toString(),
			pagina: 1,
			limite: 10,
		};

		const farmaciaMock = {
			_id: "507f1f77bcf86cd799439011",
			nome_fantasia: "Farmácia A",
			endereco: {
				estado: "SP",
				municipio: "São Paulo",
			},
			plantoes: [
				{
					entrada: agora,
					saida: amanha,
				},
			],
		};

		const responsaMock = {
			dados: [farmaciaMock],
			documentos_totais: 1,
			limite: 1000,
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

		const result = await listPorEscalaFarmaciaService(params);

		expect(result.dados).toBeDefined();
		expect(result.pagina).toBe(1);
		expect(result.limite).toBe(10);
		expect(FarmaciaRepository.findFarmacias).toHaveBeenCalledWith(
			{
				"endereco.estado": "SP",
				"endereco.municipio": "São Paulo",
				"plantoes.saida": { $gte: agora },
			},
			{
				limite: 1000,
				pagina: 1,
			},
		);
	});

	it("deve lançar erro quando tempo for inválido", async () => {
		const params = {
			tempo: "data-invalida",
			pagina: 1,
			limite: 10,
		};

		const erroMock = {
			codigo: 400,
			erro: "Tempo informado inválido",
		};

		(paginacaoUtils.extrairPaginacao as jest.Mock).mockReturnValue({
			limite: 10,
			pagina: 1,
		});

		await expect(listPorEscalaFarmaciaService(params)).rejects.toEqual(
			erroMock,
		);
	});

	it("deve filtrar por estado e municipio", async () => {
		const agora = new Date();
		const params = {
			estado: "RJ",
			municipio: "Rio de Janeiro",
			tempo: agora.toString(),
			pagina: 1,
			limite: 10,
		};

		const responsaMock = {
			dados: [],
			documentos_totais: 0,
			limite: 1000,
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

		await listPorEscalaFarmaciaService(params);

		const callArgs = (FarmaciaRepository.findFarmacias as jest.Mock).mock
			.calls[0][0];
		expect(callArgs["endereco.estado"]).toBe("RJ");
		expect(callArgs["endereco.municipio"]).toBe("Rio de Janeiro");
	});

	it("deve agrupar farmacias por dia de plantão", async () => {
		const agora = new Date();
		const amanha = new Date(agora);
		amanha.setDate(amanha.getDate() + 1);

		const params = {
			tempo: agora.toString(),
			pagina: 1,
			limite: 10,
		};

		const farmaciaMock1 = {
			_id: "507f1f77bcf86cd799439011",
			nome_fantasia: "Farmácia A",
			endereco: {
				estado: "SP",
				municipio: "São Paulo",
			},
			plantoes: [
				{
					entrada: agora,
					saida: amanha,
				},
			],
		};

		const farmaciaMock2 = {
			_id: "507f1f77bcf86cd799439012",
			nome_fantasia: "Farmácia B",
			endereco: {
				estado: "SP",
				municipio: "São Paulo",
			},
			plantoes: [
				{
					entrada: agora,
					saida: amanha,
				},
			],
		};

		const responsaMock = {
			dados: [farmaciaMock1, farmaciaMock2],
			documentos_totais: 2,
			limite: 1000,
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

		const result = await listPorEscalaFarmaciaService(params);

		expect(result.dados).toBeDefined();
		expect(typeof result.dados).toBe("object");
	});

	it("deve excluir plantoes com saida menor que tempo", async () => {
		const agora = new Date();
		const ontem = new Date(agora);
		ontem.setDate(ontem.getDate() - 1);

		const params = {
			tempo: agora.toString(),
			pagina: 1,
			limite: 10,
		};

		const farmaciaMock = {
			_id: "507f1f77bcf86cd799439011",
			nome_fantasia: "Farmácia A",
			endereco: {
				estado: "SP",
				municipio: "São Paulo",
			},
			plantoes: [
				{
					entrada: ontem,
					saida: ontem,
				},
			],
		};

		const responsaMock = {
			dados: [farmaciaMock],
			documentos_totais: 1,
			limite: 1000,
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

		const result = await listPorEscalaFarmaciaService(params);

		expect(result.documentos_totais).toBe(0);
	});

	it("deve retornar erro do repository", async () => {
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

		(FarmaciaRepository.findFarmacias as jest.Mock).mockRejectedValue(erroMock);

		await expect(listPorEscalaFarmaciaService(params)).rejects.toEqual(
			erroMock,
		);
	});
});
