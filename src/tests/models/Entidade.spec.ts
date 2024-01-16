import EntidadeModel from "../../app/models/Entidade";

const dados = {
	nome_entidade: "Ministério da Saúde",
	estado: "Rondônia",
	município: "Vilhena",
};

describe("O modelo de entidade", () => {
	it("deve cadastrar uma entidade com os dados informados", () => {
		const entidade = new EntidadeModel(dados);

		expect(entidade).toMatchObject(dados);
	});
	it("deve realizar validação dos atributos obrigatórios", async () => {
		const entidade = new EntidadeModel({});

		expect(entidade.validateSync).toThrow();

		const validar = () => {
			try {
				entidade.validateSync();

				return {};
			} catch (error: any) {
				const { nome_entidade, estado, municipio } = error.errors;

				return {
					nome_entidade: nome_entidade.message,
					estado: estado.message,
					municipio: municipio.message,
				};
			}
		};

		const erros = validar();

		console.log(erros);

		expect(erros).toHaveProperty(
			"nome_entidade",
			"Nome da entidade é obrigatório"
		);
		expect(erros).toHaveProperty("estado", "Estado é obrigatório");
		expect(erros).toHaveProperty("municipio", "Município é obrigatório");
	});
	it("deve verificar atributos inválidos", () => {
		const entidade = new EntidadeModel({
			nome_entidade: "",
			estado: "Estado Inexistente",
			municipio: "Municipio Inexistente",
		});

		expect(entidade.validateSync).toThrow();

		const validar = () => {
			try {
				entidade.validateSync();

				return {};
			} catch (error: any) {
				const { nome_entidade, estado, municipio } = error.errors;

				return {
					nome_entidade: nome_entidade.message,
					estado: estado.message,
					municipio: municipio.message,
				};
			}
		};

		const erros = validar();

		console.log(erros);

		expect(erros).toHaveProperty("nome_entidade", "Nome da entidade inválido");
		expect(erros).toHaveProperty("estado", "Estado inválido");
		expect(erros).toHaveProperty("municipio", "Município inválido");
	});
});
