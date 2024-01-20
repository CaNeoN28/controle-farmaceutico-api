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
		const farmacia = new FarmaciaModel(dados)
		const erros = farmacia.validateSync()

		expect(erros).toBeUndefined()
		expect(farmacia).toMatchObject({
			...farmacia,
			plantoes: [],
			horarios_servico: []
		})
	})
});
