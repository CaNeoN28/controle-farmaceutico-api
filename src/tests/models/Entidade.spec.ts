import mongoose from "mongoose";
import EntidadeModel from "../../app/models/Entidade";

const dados = {
	_id: new mongoose.Types.ObjectId(),
	nome_entidade: "Ministério da Saúde",
	estado: "Rondônia",
	municipio: "Vilhena",
};

describe("O modelo de entidade", () => {
	it("deve cadastrar uma entidade com os dados informados", () => {
		const entidade = new EntidadeModel(dados);

		expect(entidade).toMatchObject(dados);
	});
	it("deve realizar validação dos atributos obrigatórios", async () => {
		const entidade = new EntidadeModel({});

		const validar = () => {
			const erro = entidade.validateSync()!;
			const { nome_entidade, estado, municipio } = erro.errors;

			return {
				nome_entidade: nome_entidade.message,
				estado: estado.message,
				municipio: municipio.message,
			};
		};

		const erros = validar();

		expect(validar).not.toThrow();

		expect(erros).toHaveProperty(
			"nome_entidade",
			"Nome da entidade é obrigatório"
		);
		expect(erros).toHaveProperty("estado", "Estado é obrigatório");
		expect(erros).toHaveProperty("municipio", "Município é obrigatório");
	});
	it("deve verificar atributos inválidos", () => {
		const entidade = new EntidadeModel({
			nome_entidade: "EI",
			estado: "Estado Inexistente",
			municipio: "Municipio Inexistente",
		});

		const validar = () => {
			const erro = entidade.validateSync()!;
			const { nome_entidade, estado, municipio } = erro.errors;

			return {
				nome_entidade: nome_entidade.message,
				estado: estado.message,
				municipio: municipio.message,
			};
		};

		expect(validar).not.toThrow();

		const erros = validar();

		expect(erros).toHaveProperty("nome_entidade", "Nome da entidade inválido");
		expect(erros).toHaveProperty("estado", "Estado inválido");
		expect(erros).toHaveProperty("municipio", "Município inválido");
	});
});
