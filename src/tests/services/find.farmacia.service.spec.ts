import findFarmaciaService from "../../app/services/find.farmacia.service";
import FarmaciaRepository from "../../app/repositories/Farmacia.repository";
import { validarID } from "../../app/utils/validators";

jest.mock("../../app/repositories/Farmacia.repository");
jest.mock("../../app/utils/validators");

describe("findFarmaciaService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(validarID as jest.Mock).mockReturnValue(true);
	});

	it("deve encontrar farmacia com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const farmaciaMock = {
			_id: id,
			cnpj: "12.345.678/0001-90",
			nome_fantasia: "Farmácia Teste",
			endereco: {
				cep: "01234-567",
				estado: "SP",
				municipio: "São Paulo",
				bairro: "Centro",
				logradouro: "Rua Teste",
				numero: "123",
				localizacao: {
					x: "-23.5505",
					y: "-46.6333",
				},
			},
		};

		(FarmaciaRepository.findFarmaciaId as jest.Mock).mockResolvedValue({
			farmacia: farmaciaMock,
			erro: undefined,
		});

		const result = await findFarmaciaService(id);

		expect(result).toEqual(farmaciaMock);
		expect(FarmaciaRepository.findFarmaciaId).toHaveBeenCalledWith(id);
	});

	it("deve lançar erro quando farmacia não for encontrada", async () => {
		const id = "507f1f77bcf86cd799439012";
		const erroMock = {
			codigo: 404,
			erro: "Farmácia não encontrada",
		};

		(FarmaciaRepository.findFarmaciaId as jest.Mock).mockResolvedValue({
			farmacia: null,
			erro: erroMock,
		});

		await expect(findFarmaciaService(id)).rejects.toEqual(erroMock);
	});

	it("deve lançar erro quando id for inválido", async () => {
		const id = "invalid_id";
		(validarID as jest.Mock).mockReturnValue(false);

		await expect(findFarmaciaService(id)).rejects.toEqual({
			codigo: 400,
			erro: "Id inválido",
		});

		expect(FarmaciaRepository.findFarmaciaId).not.toHaveBeenCalled();
	});

	it("deve lançar erro de database quando repository falhar", async () => {
		const id = "507f1f77bcf86cd799439013";
		const erroMock = {
			codigo: 500,
			erro: "Erro ao conectar com o banco de dados",
		};

		(FarmaciaRepository.findFarmaciaId as jest.Mock).mockResolvedValue({
			farmacia: null,
			erro: erroMock,
		});

		await expect(findFarmaciaService(id)).rejects.toEqual(erroMock);
	});

	it("deve validar id antes de chamar repository", async () => {
		const id = "507f1f77bcf86cd799439014";
		const farmaciaMock = {
			_id: id,
			cnpj: "12.345.678/0001-91",
			nome_fantasia: "Farmácia Teste 2",
		};

		(FarmaciaRepository.findFarmaciaId as jest.Mock).mockResolvedValue({
			farmacia: farmaciaMock,
			erro: undefined,
		});

		const result = await findFarmaciaService(id);

		expect(validarID).toHaveBeenCalledWith(id);
		expect(result).toEqual(farmaciaMock);
	});
});
