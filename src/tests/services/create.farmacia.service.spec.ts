import createFarmaciaService from "../../app/services/create.farmacia.service";
import FarmaciaRepository from "../../app/repositories/Farmacia.repository";
import validarDiasServico from "../../app/utils/validarHorarioServico";
import { validarPlantoes } from "../../app/utils/validarPlantoes";

jest.mock("../../app/repositories/Farmacia.repository");
jest.mock("../../app/utils/validarHorarioServico");
jest.mock("../../app/utils/validarPlantoes");

describe("createFarmaciaService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(validarDiasServico as jest.Mock).mockReturnValue(undefined);
		(validarPlantoes as jest.Mock).mockReturnValue([]);
	});

	it("deve criar farmacia com sucesso", async () => {
		const farmaciaData = {
			cnpj: "12.345.678/0001-90",
			nome_fantasia: "Farmácia Teste",
			endereco: {
				cep: "01234-567",
				estado: "SP",
				municipio: "São Paulo",
				bairro: "Centro",
				logradouro: "Rua Teste",
				numero: "100",
				localizacao: { x: "-23.5505", y: "-46.6333" },
			},
			horarios_servico: {
				segunda_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
			},
			plantoes: [
				{
					entrada: new Date("2026-05-05T18:00:00Z"),
					saida: new Date("2026-05-06T08:00:00Z"),
				},
			],
		};

		const farmaciaMock = { ...farmaciaData, _id: "123" };
		(FarmaciaRepository.createFarmacia as jest.Mock).mockResolvedValue({
			farmacia: farmaciaMock,
			erro: undefined,
		});

		const result = await createFarmaciaService(farmaciaData);

		expect(result).toEqual(farmaciaMock);
		expect(FarmaciaRepository.createFarmacia).toHaveBeenCalledWith(farmaciaData);
		expect(validarDiasServico).toHaveBeenCalledWith(farmaciaData.horarios_servico);
		expect(validarPlantoes).toHaveBeenCalledWith(farmaciaData.plantoes);
	});

	it("deve lançar erro quando repository retornar erro", async () => {
		const farmaciaData = {
			cnpj: "12.345.678/0001-90",
			nome_fantasia: "Farmácia Teste",
			endereco: {
				cep: "01234-567",
				estado: "SP",
				municipio: "São Paulo",
				bairro: "Centro",
				logradouro: "Rua Teste",
				numero: "100",
				localizacao: { x: "-23.5505", y: "-46.6333" },
			},
			horarios_servico: {
				segunda_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
			},
		};

		const erroMock = {
			codigo: 400,
			erro: {
				mensagem: "Erro de validação",
			},
		};

		(FarmaciaRepository.createFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erro: erroMock,
		});

		await expect(createFarmaciaService(farmaciaData)).rejects.toEqual({
			codigo: 400,
			erro: erroMock.erro,
		});
	});

	it("deve lançar erro quando validarDiasServico retornar erros", async () => {
		const farmaciaData = {
			cnpj: "12.345.678/0001-90",
			nome_fantasia: "Farmácia Teste",
			endereco: {
				cep: "01234-567",
				estado: "SP",
				municipio: "São Paulo",
				bairro: "Centro",
				logradouro: "Rua Teste",
				numero: "100",
				localizacao: { x: "-23.5505", y: "-46.6333" },
			},
			horarios_servico: {
				segunda_feira: {
					horario_entrada: "25:00", // horário inválido
					horario_saida: "18:00",
				},
			},
		};

		const errosDiasServico = {
			segunda_feira: "Horário de entrada inválido",
		};

		(validarDiasServico as jest.Mock).mockReturnValue(errosDiasServico);
		(FarmaciaRepository.createFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erro: undefined,
		});

		await expect(createFarmaciaService(farmaciaData)).rejects.toEqual({
			codigo: 400,
			erro: errosDiasServico,
		});
	});

	it("deve lançar erro quando validarPlantoes retornar erros", async () => {
		const farmaciaData = {
			cnpj: "12.345.678/0001-90",
			nome_fantasia: "Farmácia Teste",
			endereco: {
				cep: "01234-567",
				estado: "SP",
				municipio: "São Paulo",
				bairro: "Centro",
				logradouro: "Rua Teste",
				numero: "100",
				localizacao: { x: "-23.5505", y: "-46.6333" },
			},
			horarios_servico: {
				segunda_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
			},
			plantoes: [
				{
					entrada: new Date("2026-05-06T08:00:00Z"), // saída antes da entrada
					saida: new Date("2026-05-05T18:00:00Z"),
				},
			],
		};

		const errosPlantoes = [
			{
				entrada: new Date("2026-05-06T08:00:00Z"),
				saida: new Date("2026-05-05T18:00:00Z"),
				mensagem: "Plantão inválido",
			},
		];

		(validarPlantoes as jest.Mock).mockReturnValue(errosPlantoes);
		(FarmaciaRepository.createFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erro: undefined,
		});

		await expect(createFarmaciaService(farmaciaData)).rejects.toEqual({
			codigo: 400,
			erro: {
				plantoes: errosPlantoes,
			},
		});
	});

	it("deve combinar erros de repository, dias de serviço e plantoes", async () => {
		const farmaciaData = {
			cnpj: "12.345.678/0001-90",
			nome_fantasia: "Farmácia Teste",
			endereco: {
				cep: "01234-567",
				estado: "SP",
				municipio: "São Paulo",
				bairro: "Centro",
				logradouro: "Rua Teste",
				numero: "100",
				localizacao: { x: "-23.5505", y: "-46.6333" },
			},
			horarios_servico: {
				segunda_feira: {
					horario_entrada: "25:00",
					horario_saida: "18:00",
				},
			},
			plantoes: [
				{
					entrada: new Date("2026-05-06T08:00:00Z"),
					saida: new Date("2026-05-05T18:00:00Z"),
				},
			],
		};

		const errosDiasServico = {
			segunda_feira: "Horário de entrada inválido",
		};

		const errosPlantoes = [
			{
				entrada: new Date("2026-05-06T08:00:00Z"),
				saida: new Date("2026-05-05T18:00:00Z"),
				mensagem: "Plantão inválido",
			},
		];

		const erroRepository = {
			codigo: 500,
			erro: {
				mensagem: "Erro interno",
			},
		};

		(validarDiasServico as jest.Mock).mockReturnValue(errosDiasServico);
		(validarPlantoes as jest.Mock).mockReturnValue(errosPlantoes);
		(FarmaciaRepository.createFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erro: erroRepository,
		});

		await expect(createFarmaciaService(farmaciaData)).rejects.toEqual({
			codigo: 400,
			erro: {
				...errosDiasServico,
				plantoes: errosPlantoes,
				...erroRepository.erro,
			},
		});
	});
});