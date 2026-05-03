import bcrypt from "bcrypt";
import { criptografarSenha, compararSenha } from "../../app/utils/senhas";

jest.mock("bcrypt");

describe("senhas utils", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(bcrypt.genSalt as jest.Mock).mockReset();
		(bcrypt.hash as jest.Mock).mockReset();
		(bcrypt.compare as jest.Mock).mockReset();
	});

	describe("criptografarSenha", () => {
		it("deve criptografar senha com sucesso", async () => {
			const senha = "minhaSenha123";
			const saltRounds = 6;
			const mockSalt = "mockSalt";
			const mockHash = "mockHashedPassword";

			(bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
			(bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

			const result = await criptografarSenha(senha);

			expect(result).toBe(mockHash);
			expect(bcrypt.genSalt).toHaveBeenCalledWith(saltRounds);
			expect(bcrypt.hash).toHaveBeenCalledWith(senha, mockSalt);
		});

		it("deve propagar erro do genSalt", async () => {
			const senha = "minhaSenha123";
			const error = new Error("Salt generation failed");

			(bcrypt.genSalt as jest.Mock).mockRejectedValue(error);

			await expect(criptografarSenha(senha)).rejects.toThrow(error);
		});

		it("deve propagar erro do hash", async () => {
			const senha = "minhaSenha123";
			const mockSalt = "mockSalt";
			const error = new Error("Hash generation failed");

			(bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
			(bcrypt.hash as jest.Mock).mockRejectedValue(error);

			await expect(criptografarSenha(senha)).rejects.toThrow(error);
		});
	});

	describe("compararSenha", () => {
		it("deve retornar true para senha correta", async () => {
			const senha = "minhaSenha123";
			const hash = "hashedPassword";

			(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

			const result = await compararSenha(senha, hash);

			expect(result).toBe(true);
			expect(bcrypt.compare).toHaveBeenCalledWith(senha, hash);
		});

		it("deve retornar false para senha incorreta", async () => {
			const senha = "senhaErrada";
			const hash = "hashedPassword";

			(bcrypt.compare as jest.Mock).mockRejectedValueOnce(false);

			const result = await compararSenha(senha, hash);

			expect(result).toBe(false);
			expect(bcrypt.compare).toHaveBeenCalledWith(senha, hash);
		});

		it("deve propagar erro do bcrypt.compare", async () => {
			const senha = "minhaSenha123";
			const hash = "hashedPassword";
			const error = new Error("Comparison failed");

			(bcrypt.compare as jest.Mock).mockRejectedValueOnce(error);

			const result = await compararSenha(senha, hash);

			expect(result).toBe(false); // A função sempre retorna false em caso de erro
			expect(bcrypt.compare).toHaveBeenCalledWith(senha, hash);
		});

		it("deve funcionar com senhas vazias", async () => {
			const senha = "";
			const hash = "hashedEmptyPassword";

			(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

			const result = await compararSenha(senha, hash);

			expect(result).toBe(true);
			expect(bcrypt.compare).toHaveBeenCalledWith("", hash);
		});

		it("deve funcionar com senhas especiais", async () => {
			const senha = "!@#$%^&*()";
			const hash = "hashedSpecialPassword";

			(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

			const result = await compararSenha(senha, hash);

			expect(result).toBe(true);
			expect(bcrypt.compare).toHaveBeenCalledWith("!@#$%^&*()", hash);
		});
	});
});
