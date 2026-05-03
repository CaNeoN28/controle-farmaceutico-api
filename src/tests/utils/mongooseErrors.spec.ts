import { erroParaDicionario } from "../../app/utils/mongooseErrors";

describe("erroParaDicionario", () => {
	it("deve retornar código 400 e mensagens por campo em erro de validação", () => {
		const resultado = erroParaDicionario("Farmacia", {
			message: "Validation failed",
			errors: {
				cnpj: { message: "CNPJ inválido" },
				nome_fantasia: { message: "Nome obrigatório" },
			},
		});

		expect(resultado).toEqual({
			codigo: 400,
			erros: {
				cnpj: "CNPJ inválido",
				nome_fantasia: "Nome obrigatório",
			},
		});
	});

	it("deve retornar código 400 com a mensagem do campo em CastError", () => {
		const resultado = erroParaDicionario("Farmacia", {
			name: "CastError",
			path: "_id",
			message: "Cast to ObjectId failed",
		});

		expect(resultado).toEqual({
			codigo: 400,
			erros: {
				_id: "Cast to ObjectId failed",
			},
		});
	});

	it("deve retornar código 500 e objeto vazio de erros em erro não tratado", () => {
		const resultado = erroParaDicionario("Farmacia", {
			message: "Some unexpected error",
		});

		expect(resultado).toEqual({
			codigo: 500,
			erros: {},
		});
	});

	it("deve retornar código 400 com múltiplos campos de validação", () => {
		const resultado = erroParaDicionario("Usuario", {
			message: "validation failed: email, senha, nome_usuario",
			errors: {
				email: { message: "Email inválido" },
				senha: { message: "Senha muito curta" },
				nome_usuario: { message: "Usuário já existe" },
			},
		});

		expect(resultado).toEqual({
			codigo: 400,
			erros: {
				email: "Email inválido",
				senha: "Senha muito curta",
				nome_usuario: "Usuário já existe",
			},
		});
	});

	it("deve retornar código 500 para erro genérico sem mensagem de validação", () => {
		const resultado = erroParaDicionario("Entidade", {
			message: "Database connection error",
		});

		expect(resultado).toEqual({
			codigo: 500,
			erros: {},
		});
	});

	it("deve retornar código 400 para CastError em diferentes caminhos", () => {
		const resultado = erroParaDicionario("Usuario", {
			name: "CastError",
			path: "entidade_relacionada",
			message: "Cast to ObjectId failed for value",
		});

		expect(resultado).toEqual({
			codigo: 400,
			erros: {
				entidade_relacionada: "Cast to ObjectId failed for value",
			},
		});
	});
});
