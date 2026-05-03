import verificarTokenRecuperacaoService from "../../app/services/verificar.recuperacao.service";

const validToken = "token_recuperacao_valido";

jest.mock("../../app/utils/jwt", () => ({
	verificarToken: (token: string) => {
		if (token === validToken) {
			return {
				nome_usuario: "antonio_bandeira",
			};
		} else if (token === "token_usuario_inexistente") {
			return {
				nome_usuario: "usuario_inexistente",
			};
		}

		return false;
	},
}));

jest.mock("../../app/repositories/Usuario.repository", () => ({
	verificarToken: (username: string) => {
		if (username === "antonio_bandeira") {
			return {
				usuario: {
					token_recuperacao: validToken,
				},
			};
		}

		return { usuario: null };
	},
}));

describe("O serviço de verificação de recuperação", () => {
	it("não deve retornar nada em um token válido", () => {
		expect(
			async () => await verificarTokenRecuperacaoService(validToken),
		).resolves.toBeUndefined();
	});

	it("deve lançar um erro para um token inválido", () => {
		expect(
			async () => await verificarTokenRecuperacaoService("token_invalido"),
		).rejects.toMatchObject({
			codigo: 401,
			erro: "Token inválido",
		});
	});

	it("deve lançar um erro para um token válido, mas que não corresponde ao usuário", () => {
		expect(
			async () =>
				await verificarTokenRecuperacaoService("token_usuario_inexistente"),
		).rejects.toMatchObject({
			codigo: 401,
			erro: "Token inválido",
		});
	});
});
