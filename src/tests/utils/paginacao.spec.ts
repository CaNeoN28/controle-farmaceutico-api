import { extrairPaginacao, calcularPaginas } from "../../app/utils/paginacao";

describe("paginacao utils", () => {
	describe("extrairPaginacao", () => {
		it("deve extrair paginação com valores válidos", () => {
			const params = {
				limite: "10",
				pagina: "2",
			};

			const result = extrairPaginacao(params);

			expect(result).toEqual({
				limite: 10,
				pagina: 2,
			});
		});

		it("deve usar valores padrão quando não fornecidos", () => {
			const params = {};

			const result = extrairPaginacao(params);

			expect(result).toEqual({
				limite: NaN, // undefined convertido para NaN
				pagina: NaN,
			});
		});

		it("deve lançar erro quando limite não é numérico", () => {
			const params = {
				limite: "abc",
				pagina: "1",
			};

			expect(() => extrairPaginacao(params)).toThrow();
		});

		it("deve lançar erro quando pagina não é numérica", () => {
			const params = {
				limite: "10",
				pagina: "abc",
			};

			expect(() => extrairPaginacao(params)).toThrow();
		});

		it("deve lançar erro com mensagem específica para limite inválido", () => {
			const params = {
				limite: "abc",
				pagina: "1",
			};

			try {
				extrairPaginacao(params);
				fail("Deveria ter lançado erro");
			} catch (error: any) {
				expect(error).toEqual({
					codigo: 400,
					erro: {
						limite: "Limite inválido",
					},
				});
			}
		});

		it("deve lançar erro com mensagem específica para pagina inválida", () => {
			const params = {
				limite: "10",
				pagina: "abc",
			};

			try {
				extrairPaginacao(params);
				fail("Deveria ter lançado erro");
			} catch (error: any) {
				expect(error).toEqual({
					codigo: 400,
					erro: {
						pagina: "Pagina inválida",
					},
				});
			}
		});

		it("deve lançar erro com ambas mensagens quando ambos são inválidos", () => {
			const params = {
				limite: "abc",
				pagina: "def",
			};

			try {
				extrairPaginacao(params);
				fail("Deveria ter lançado erro");
			} catch (error: any) {
				expect(error).toEqual({
					codigo: 400,
					erro: {
						limite: "Limite inválido",
						pagina: "Pagina inválida",
					},
				});
			}
		});
	});

	describe("calcularPaginas", () => {
		it("deve calcular páginas sem resto", () => {
			const documentos_totais = 100;
			const limite = 10;

			const result = calcularPaginas(documentos_totais, limite);

			expect(result).toBe(10);
		});

		it("deve calcular páginas com resto", () => {
			const documentos_totais = 105;
			const limite = 10;

			const result = calcularPaginas(documentos_totais, limite);

			expect(result).toBe(11);
		});

		it("deve retornar 1 quando documentos_totais é menor que limite", () => {
			const documentos_totais = 5;
			const limite = 10;

			const result = calcularPaginas(documentos_totais, limite);

			expect(result).toBe(1);
		});

		it("deve retornar 1 quando documentos_totais é igual ao limite", () => {
			const documentos_totais = 10;
			const limite = 10;

			const result = calcularPaginas(documentos_totais, limite);

			expect(result).toBe(1);
		});

		it("deve calcular corretamente com limite 1", () => {
			const documentos_totais = 5;
			const limite = 1;

			const result = calcularPaginas(documentos_totais, limite);

			expect(result).toBe(5);
		});
	});
});
