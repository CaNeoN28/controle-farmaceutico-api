import FarmaciaModel from "../../app/models/Farmacia";
import Farmacia from "../../types/Farmacia";

const dados = new Farmacia({
	cnpj: "94446934000103",
	endereco: {
		bairro: "Jardim das flores",
		cep: "76980000",
		estado: "Rondônia",
		localizacao: {
			x: "0.0",
			y: "0.0",
		},
		logradouro: "Rua das rosas",
		municipio: "Vilhena",
		numero: "0",
	},
	nome_fantasia: "Farmácia Teste",
});

describe("O modelo de farmácia", () => {
	it("deve criar com sucesso uma farmácia válida", () => {
		const farmacia = new FarmaciaModel(dados);
		const erros = farmacia.validateSync();

		expect(erros).toBeUndefined();
		expect(farmacia).toMatchObject({
			...farmacia,
			plantoes: [],
			horarios_servico: [],
		});
	});

	it("deve realizar validação dos atributos obrigatórios", () => {
		const farmacia = new FarmaciaModel({});

		const validar = () => {
			const erros = farmacia.validateSync()!;
			const {
				cnpj,
				nome_fantasia: nome_fantasia,
				"endereco.bairro": endereco_bairro,
				"endereco.cep": endereco_cep,
				"endereco.estado": endereco_estado,
				"endereco.localizacao": endereco_localizacao,
				"endereco.logradouro": endereco_logradouro,
				"endereco.municipio": endereco_municipio,
				"endereco.numero": endereco_numero,
			} = erros.errors;

			return {
				cnpj: cnpj.message,
				nome_fantasia: nome_fantasia.message,
				endereco_bairro: endereco_bairro.message,
				endereco_cep: endereco_cep.message,
				endereco_estado: endereco_estado.message,
				endereco_localizacao: endereco_localizacao.message,
				endereco_logradouro: endereco_logradouro.message,
				endereco_municipio: endereco_municipio.message,
				endereco_numero: endereco_numero.message,
			};
		};

		expect(validar).not.toThrow();

		const erros = validar();

		expect(erros).toMatchObject({
			cnpj: "CNPJ é obrigatório",
			nome_fantasia: "Nome fantasia é obrigatório",
			endereco_bairro: "Bairro é obrigatório",
			endereco_cep: "CEP é obrigatório",
			endereco_estado: "Estado é obrigatório",
			endereco_municipio: "Município é obrigatório",
			endereco_localizacao: "Localizacao é obrigatório",
			endereco_logradouro: "Logradouro é obrigatório",
			endereco_numero: "Número é obrigatório",
		});
	});

	it("deve realizar validação dos dados de farmácia", () => {
		const farmacia = new FarmaciaModel({
			cnpj: "00000000000000",
			endereco: {
				bairro: "BI",
				cep: "00000000",
				estado: "Estado inválido",
				localizacao: {},
				logradouro: "LI",
				municipio: "Município inválido",
				numero: "NI",
			},
			nome_fantasia: "NF",
		});

		const validar = () => {
			const erros = farmacia.validateSync()!;
			const {
				cnpj,
				nome_fantasia: nome_fantasia,
				"endereco.bairro": endereco_bairro,
				"endereco.cep": endereco_cep,
				"endereco.estado": endereco_estado,
				"endereco.localizacao": endereco_localizacao,
				"endereco.logradouro": endereco_logradouro,
				"endereco.municipio": endereco_municipio,
				"endereco.numero": endereco_numero,
			} = erros.errors;

			return {
				cnpj: cnpj.message,
				nome_fantasia: nome_fantasia.message,
				endereco_bairro: endereco_bairro.message,
				endereco_cep: endereco_cep.message,
				endereco_estado: endereco_estado.message,
				endereco_localizacao: endereco_localizacao.message,
				endereco_logradouro: endereco_logradouro.message,
				endereco_municipio: endereco_municipio.message,
				endereco_numero: endereco_numero.message,
			};
		};

		expect(validar).not.toThrow();

		const erros = validar();

		expect(erros).toMatchObject({
			cnpj: "CNPJ inválido",
			nome_fantasia: "Nome fantasia inválido",
			endereco_bairro: "Bairro inválido",
			endereco_cep: "CEP inválido",
			endereco_estado: "Estado inválido",
			endereco_municipio: "Município inválido",
			endereco_localizacao: "Localizacao inválida",
			endereco_logradouro: "Logradouro inválido",
			endereco_numero: "Número inválido",
		});
	});
});
