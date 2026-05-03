import updateFarmaciaService from "../../app/services/update.farmacia.service";
import FarmaciaRepository from "../../app/repositories/Farmacia.repository";
import validarDiasServico from "../../app/utils/validarHorarioServico";
import { validarPlantoes } from "../../app/utils/validarPlantoes";
import { validarID } from "../../app/utils/validators";

jest.mock("../../app/repositories/Farmacia.repository");
jest.mock("../../app/utils/validarHorarioServico");
jest.mock("../../app/utils/validarPlantoes");
jest.mock("../../app/utils/validators");

describe("updateFarmaciaService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(validarID as jest.Mock).mockReturnValue(true);
		(validarDiasServico as jest.Mock).mockReturnValue(undefined);
		(validarPlantoes as jest.Mock).mockReturnValue([]);
	});

	it("deve atualizar farmacia com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const dataAtualizar = {
			nome_fantasia: "Farmácia Atualizada",
			horarios_servico: {
				segunda_feira: {
					horario_entrada: "08:00",
					horario_saida: "18:00",
				},
			},
		};

		const farmaciaMock = {
			_id: id,
			...dataAtualizar,
			cnpj: "12.345.678/0001-90",
			endereco: {
				cep: "01234-567",
				estado: "SP",
				municipio: "São Paulo",
				bairro: "Centro",
				logradouro: "Rua Teste",
				numero: "123",
				localizacao: { x: "-23.5505", y: "-46.6333" },
			},
		};

		(FarmaciaRepository.updateFarmacia as jest.Mock).mockResolvedValue({
			farmacia: farmaciaMock,
			erros: undefined,
		});

		const result = await updateFarmaciaService(id, dataAtualizar);

		expect(result).toEqual(farmaciaMock);
		expect(FarmaciaRepository.updateFarmacia).toHaveBeenCalledWith(
			id,
			dataAtualizar,
		);
	});

	it("deve lançar erro quando id for inválido", async () => {
		const id = "invalid_id";
		const dataAtualizar = {
			nome_fantasia: "Farmácia Atualizada",
		};

		(validarID as jest.Mock).mockReturnValue(false);

		await expect(updateFarmaciaService(id, dataAtualizar)).rejects.toEqual({
			codigo: 400,
			erro: "Id inválido",
		});

		expect(FarmaciaRepository.updateFarmacia).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando farmacia não for encontrada", async () => {
		const id = "507f1f77bcf86cd799439012";
		const dataAtualizar = {
			nome_fantasia: "Farmácia Atualizada",
		};

		const erroMock = {
			codigo: 404,
			erro: "Farmácia não encontrada",
		};

		(FarmaciaRepository.updateFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erros: erroMock,
		});

		await expect(updateFarmaciaService(id, dataAtualizar)).rejects.toEqual({
			codigo: 404,
			erro: "Farmácia não encontrada",
		});
	});

	it("deve lançar erro quando horarios_servico for inválido", async () => {
		const id = "507f1f77bcf86cd799439013";
		const dataAtualizar = {
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
		(FarmaciaRepository.updateFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erros: undefined,
		});

		await expect(updateFarmaciaService(id, dataAtualizar)).rejects.toEqual({
			codigo: 400,
			erro: errosDiasServico,
		});
	});

	it("deve lançar erro quando plantoes forem inválidos", async () => {
		const id = "507f1f77bcf86cd799439014";
		const dataAtualizar = {
			plantoes: [
				{
					entrada: new Date("2026-05-06T08:00:00Z"),
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
		(FarmaciaRepository.updateFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erros: undefined,
		});

		await expect(updateFarmaciaService(id, dataAtualizar)).rejects.toEqual({
			codigo: 400,
			erro: {
				plantoes: errosPlantoes,
			},
		});
	});

	it("deve combinar erros de validação e repository", async () => {
		const id = "507f1f77bcf86cd799439015";
		const dataAtualizar = {
			horarios_servico: {
				segunda_feira: {
					horario_entrada: "25:00",
					horario_saida: "18:00",
				},
			},
		};

		const errosDiasServico = {
			segunda_feira: "Horário de entrada inválido",
		};

		const erroRepository = {
			codigo: 409,
			erro: {
				cnpj: "CNPJ já cadastrado",
			},
		};

		(validarDiasServico as jest.Mock).mockReturnValue(errosDiasServico);
		(FarmaciaRepository.updateFarmacia as jest.Mock).mockResolvedValue({
			farmacia: null,
			erros: erroRepository,
		});

		await expect(updateFarmaciaService(id, dataAtualizar)).rejects.toEqual({
			codigo: 409,
			erro: {
				cnpj: "CNPJ já cadastrado",
				segunda_feira: "Horário de entrada inválido",
			},
		});
	});
});
