import validarCEP from "../../app/utils/validarCEP";

describe("validarCEP", () => {
	it("deve validar CEP válido sem formatação", () => {
		const cep = "12345678";
		const result = validarCEP(cep);
		expect(result).toBe(true);
	});

	it("deve validar CEP válido com espaços", () => {
		const cep = "12345 678";
		const result = validarCEP(cep);
		expect(result).toBe(true);
	});

	it("deve validar CEP válido com hífen", () => {
		const cep = "12345-678";
		const result = validarCEP(cep);
		expect(result).toBe(true);
	});

	it("deve validar CEP válido com espaços e hífen", () => {
		const cep = "12345 - 678";
		const result = validarCEP(cep);
		expect(result).toBe(true);
	});

	it("deve rejeitar CEP com menos de 8 dígitos", () => {
		const cep = "1234567";
		const result = validarCEP(cep);
		expect(result).toBe(false);
	});

	it("deve rejeitar CEP com mais de 8 dígitos", () => {
		const cep = "123456789";
		const result = validarCEP(cep);
		expect(result).toBe(false);
	});

	it("deve rejeitar CEP vazio", () => {
		const cep = "";
		const result = validarCEP(cep);
		expect(result).toBe(false);
	});

	it("deve rejeitar CEP com caracteres não numéricos", () => {
		const cep = "12345abc";
		const result = validarCEP(cep);
		expect(result).toBe(false);
	});

	it("deve rejeitar CEP com apenas letras", () => {
		const cep = "abcdefgh";
		const result = validarCEP(cep);
		expect(result).toBe(false);
	});

	it("deve rejeitar CEP com caracteres especiais", () => {
		const cep = "12345!@#";
		const result = validarCEP(cep);
		expect(result).toBe(false);
	});
	
	it("deve validar CEP com zeros à esquerda", () => {
		const cep = "00123456";
		const result = validarCEP(cep);
		expect(result).toBe(true);
	});
});
