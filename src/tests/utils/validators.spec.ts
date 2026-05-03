import { validarID, validarEmail, validarNomeDeUsuario, validarSenha } from "../../app/utils/validators";
import mongoose from "mongoose";

jest.mock("mongoose");

describe("validators", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("validarID", () => {
		it("deve validar ID válido do MongoDB", () => {
			const id = "507f1f77bcf86cd799439011";

			(mongoose.isValidObjectId as jest.Mock).mockReturnValue(true);

			const result = validarID(id);

			expect(result).toBe(true);
			expect(mongoose.isValidObjectId).toHaveBeenCalledWith(id);
		});

		it("deve rejeitar ID inválido do MongoDB", () => {
			const id = "invalid_id";

			(mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

			const result = validarID(id);

			expect(result).toBe(false);
			expect(mongoose.isValidObjectId).toHaveBeenCalledWith(id);
		});

		it("deve rejeitar ID vazio", () => {
			const id = "";

			(mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

			const result = validarID(id);

			expect(result).toBe(false);
		});

		it("deve rejeitar ID nulo", () => {
			const id = null as any;

			(mongoose.isValidObjectId as jest.Mock).mockReturnValue(false);

			const result = validarID(id);

			expect(result).toBe(false);
		});
	});

	describe("validarEmail", () => {
		it("deve validar email válido", () => {
			const emails = [
				"test@example.com",
				"user.name@domain.co.uk",
				"test-tag@gmail.com",
				"123@test.org",
			];

			emails.forEach((email) => {
				const result = validarEmail(email);
				expect(result).toBe(true);
			});
		});

		it("deve rejeitar email sem @", () => {
			const email = "testexample.com";
			const result = validarEmail(email);
			expect(result).toBe(false);
		});

		it("deve rejeitar email sem domínio", () => {
			const email = "test@";
			const result = validarEmail(email);
			expect(result).toBe(false);
		});

		it("deve rejeitar email sem nome de usuário", () => {
			const email = "@example.com";
			const result = validarEmail(email);
			expect(result).toBe(false);
		});

		it("deve rejeitar email com espaços", () => {
			const email = "test @example.com";
			const result = validarEmail(email);
			expect(result).toBe(false);
		});

		it("deve rejeitar email vazio", () => {
			const email = "";
			const result = validarEmail(email);
			expect(result).toBe(false);
		});

		it("deve rejeitar email nulo", () => {
			const email = null as any;
			const result = validarEmail(email);
			expect(result).toBe(false);
		});
	});

	describe("validarNomeDeUsuario", () => {
		it("deve validar nome de usuário válido", () => {
			const usernames = [
				"usuario123",
				"test_user",
				"username",
				"abc",
				"usuario_teste_123",
			];

			usernames.forEach((username) => {
				const result = validarNomeDeUsuario(username);
				expect(result).toBe(true);
			});
		});

		it("deve rejeitar nome de usuário muito curto", () => {
			const username = "ab";
			const result = validarNomeDeUsuario(username);
			expect(result).toBe(false);
		});

		it("deve rejeitar nome de usuário começando com underscore", () => {
			const username = "_usuario";
			const result = validarNomeDeUsuario(username);
			expect(result).toBe(false);
		});

		it("deve rejeitar nome de usuário terminando com underscore", () => {
			const username = "usuario_";
			const result = validarNomeDeUsuario(username);
			expect(result).toBe(false);
		});

		it("deve rejeitar nome de usuário com underscores consecutivos", () => {
			const username = "user__name";
			const result = validarNomeDeUsuario(username);
			expect(result).toBe(false);
		});

		it("deve rejeitar nome de usuário vazio", () => {
			const username = "";
			const result = validarNomeDeUsuario(username);
			expect(result).toBe(false);
		});

		it("deve rejeitar nome de usuário com caracteres especiais inválidos", () => {
			const usernames = [
				"user@name",
				"user name",
				"user#name",
				"user-name",
			];

			usernames.forEach((username) => {
				const result = validarNomeDeUsuario(username);
				expect(result).toBe(false);
			});
		});

		it("deve aceitar nome de usuário com números", () => {
			const username = "usuario123";
			const result = validarNomeDeUsuario(username);
			expect(result).toBe(true);
		});

		it("deve aceitar nome de usuário com letras maiúsculas", () => {
			const username = "Usuario";
			const result = validarNomeDeUsuario(username);
			expect(result).toBe(true);
		});
	});

	describe("validarSenha", () => {
		it("deve validar senha forte", () => {
			const senhas = [
				"Senha123!",
				"Minha@Senha#2023",
				"Teste*456",
				"Abc123!@#",
			];

			senhas.forEach((senha) => {
				const result = validarSenha(senha);
				expect(result).toBe(true);
			});
		});

		it("deve rejeitar senha sem letra maiúscula", () => {
			const senha = "senha123!";
			const result = validarSenha(senha);
			expect(result).toBe(false);
		});

		it("deve rejeitar senha sem letra minúscula", () => {
			const senha = "SENHA123!";
			const result = validarSenha(senha);
			expect(result).toBe(false);
		});

		it("deve rejeitar senha sem número", () => {
			const senha = "Senha!";
			const result = validarSenha(senha);
			expect(result).toBe(false);
		});

		it("deve rejeitar senha sem caractere especial", () => {
			const senha = "Senha123";
			const result = validarSenha(senha);
			expect(result).toBe(false);
		});

		it("deve rejeitar senha muito curta", () => {
			const senha = "Ab1!";
			const result = validarSenha(senha);
			expect(result).toBe(false);
		});

		it("deve aceitar senha com exatamente 8 caracteres", () => {
			const senha = "Abc123!@";
			const result = validarSenha(senha);
			expect(result).toBe(true);
		});

		it("deve aceitar senha longa", () => {
			const senha = "MinhaSenhaSuperLongaComCaracteresEspeciais123!@#";
			const result = validarSenha(senha);
			expect(result).toBe(true);
		});

		it("deve rejeitar senha vazia", () => {
			const senha = "";
			const result = validarSenha(senha);
			expect(result).toBe(false);
		});

		it("deve rejeitar senha nula", () => {
			const senha = null as any;
			const result = validarSenha(senha);
			expect(result).toBe(false);
		});

		it("deve aceitar diferentes caracteres especiais", () => {
			const senhas = [
				"Senha123@",
				"Senha123#",
				"Senha123$",
				"Senha123&",
				"Senha123*",
				"Senha123.",
			];

			senhas.forEach((senha) => {
				const result = validarSenha(senha);
				expect(result).toBe(true);
			});
		});
	});
});
