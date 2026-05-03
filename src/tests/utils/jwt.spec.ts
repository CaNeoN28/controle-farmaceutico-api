import jwt from "jsonwebtoken";
import { generateToken, generateTokenFromUser, verificarToken } from "../../app/utils/jwt";

jest.mock("jsonwebtoken");

describe("jwt utils", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("generateToken", () => {
		it("deve gerar token com sucesso", () => {
			const data = {
				id: "123",
				email: "test@test.com",
				funcao: "USUARIO",
				nome_usuario: "testuser",
				numero_registro: "12345",
			};
			const tempoExpiracao = 3600;
			const mockToken = "mock.jwt.token";

			process.env.SECRET_KEY = "test_secret";

			(jwt.sign as jest.Mock).mockReturnValue(mockToken);

			const result = generateToken(data, tempoExpiracao);

			expect(result).toBe(mockToken);
			expect(jwt.sign).toHaveBeenCalledWith(
				{
					id: "123",
					email: "test@test.com",
					funcao: "USUARIO",
					nome_usuario: "testuser",
					numero_registro: "12345",
				},
				"test_secret",
				{
					expiresIn: 3600,
				}
			);
		});

		it("deve usar SECRET_KEY padrão se não estiver definida", () => {
			delete process.env.SECRET_KEY;

			const data = { id: "123" };
			const tempoExpiracao = 3600;
			const mockToken = "mock.jwt.token";

			(jwt.sign as jest.Mock).mockReturnValue(mockToken);

			const result = generateToken(data, tempoExpiracao);

			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: "123" },
				"",
				{ expiresIn: 3600 }
			);
		});
	});

	describe("verificarToken", () => {
		it("deve verificar token válido", () => {
			const token = "valid.jwt.token";
			const decodedPayload = { id: "123", email: "test@test.com" };
			const key = "test_secret";

			process.env.SECRET_KEY = key;

			(jwt.verify as jest.Mock).mockReturnValue(decodedPayload);

			const result = verificarToken(token);

			expect(result).toEqual(decodedPayload);
			expect(jwt.verify).toHaveBeenCalledWith(token, key);
		});

		it("deve retornar false para token inválido", () => {
			const token = "invalid.jwt.token";
			const key = "test_secret";

			process.env.SECRET_KEY = key;

			(jwt.verify as jest.Mock).mockImplementation(() => {
				throw new Error("Invalid token");
			});

			const result = verificarToken(token);

			expect(result).toBe(false);
		});

		it("deve usar SECRET_KEY padrão se não estiver definida", () => {
			delete process.env.SECRET_KEY;
			const token = "token";

			(jwt.verify as jest.Mock).mockReturnValue({ id: "123" });

			const result = verificarToken(token);

			expect(jwt.verify).toHaveBeenCalledWith(token, "");
		});
	});

	describe("generateTokenFromUser", () => {
		it("deve gerar token do usuário com sucesso", () => {
			const user = {
				_id: "507f1f77bcf86cd799439011",
				email: "test@test.com",
				dados_administrativos: {
					funcao: "USUARIO",
				},
				nome_usuario: "testuser",
				numero_registro: "12345",
			};

			const mockToken = "user.jwt.token";
			process.env.SECRET_KEY = "test_secret";

			(jwt.sign as jest.Mock).mockReturnValue(mockToken);

			const result = generateTokenFromUser(user);

			expect(result).toBe(mockToken);
			expect(jwt.sign).toHaveBeenCalledWith(
				{
					id: "507f1f77bcf86cd799439011",
					email: "test@test.com",
					funcao: "USUARIO",
					nome_usuario: "testuser",
					numero_registro: "12345",
				},
				"test_secret",
				{
					expiresIn: 21600, // 6 * 60 * 60
				}
			);
		});

		it("deve retornar undefined se dados obrigatórios estiverem faltando", () => {
			const user = {
				email: "test@test.com",
				// faltando dados_administrativos
			};

			const result = generateTokenFromUser(user);

			expect(result).toBeUndefined();
			expect(jwt.sign).not.toHaveBeenCalled();
		});

		it("deve retornar undefined se _id estiver faltando", () => {
			const user = {
				email: "test@test.com",
				dados_administrativos: {
					funcao: "USUARIO",
				},
				nome_usuario: "testuser",
				numero_registro: "12345",
				// faltando _id
			};

			const result = generateTokenFromUser(user);

			expect(result).toBeUndefined();
		});

		it("deve retornar undefined se nome_usuario estiver faltando", () => {
			const user = {
				_id: "123",
				email: "test@test.com",
				dados_administrativos: {
					funcao: "USUARIO",
				},
				// faltando nome_usuario
				numero_registro: "12345",
			};

			const result = generateTokenFromUser(user);

			expect(result).toBeUndefined();
		});

		it("deve retornar undefined se numero_registro estiver faltando", () => {
			const user = {
				_id: "123",
				email: "test@test.com",
				dados_administrativos: {
					funcao: "USUARIO",
				},
				nome_usuario: "testuser",
				// faltando numero_registro
			};

			const result = generateTokenFromUser(user);

			expect(result).toBeUndefined();
		});
	});
});
