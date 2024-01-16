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
	it("deve realizar validação dos atributos obrigatórios", () => {});
	it("deve verificar atributos inválidos", () => {});
});
