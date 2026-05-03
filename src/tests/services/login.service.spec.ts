import loginService from "../../app/services/login.service";
import UsuarioRepository from "../../app/repositories/Usuario.repository";
import * as jwtUtils from "../../app/utils/jwt";

jest.mock("../../app/repositories/Usuario.repository");
jest.mock("../../app/utils/jwt");

describe("loginService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve fazer login com sucesso", async () => {
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439011",
			nome_completo: "Usuário Teste",
			email: "usuario@example.com",
			nome_usuario: "usuario_teste",
			cpf: "12345678901",
			numero_registro: "CRF12345",
			senha: "hashed_password",
			token_recuperacao: undefined,
			dados_administrativos: {
				funcao: "USUARIO",
				entidade_relacionada: "507f1f77bcf86cd799439012",
			},
		};

		const tokenMock = "jwt_token_123";

		(UsuarioRepository.login as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			senhaCorreta: true,
		});

		(jwtUtils.generateTokenFromUser as jest.Mock).mockReturnValue(tokenMock);

		const result = await loginService({
			nome_usuario: "usuario_teste",
			senha: "senha123",
		});

		expect(result.usuario).toEqual({
			...usuarioMock,
			senha: undefined,
			token_recuperacao: undefined,
		});
		expect(result.token).toEqual(tokenMock);
		expect(UsuarioRepository.login).toHaveBeenCalledWith({
			nome_usuario: "usuario_teste",
			senha: "senha123",
		});
	});

	it("deve lançar erro quando credenciais forem inválidas", async () => {
		(UsuarioRepository.login as jest.Mock).mockResolvedValue({
			usuario: null,
			senhaCorreta: false,
		});

		await expect(
			loginService({
				nome_usuario: "usuario_teste",
				senha: "senha_errada",
			}),
		).rejects.toEqual({
			codigo: 401,
			erro: "Não foi possível realizar autenticação",
		});
	});

	it("deve lançar erro quando usuário não existir", async () => {
		(UsuarioRepository.login as jest.Mock).mockResolvedValue({
			usuario: null,
			senhaCorreta: false,
		});

		await expect(
			loginService({
				nome_usuario: "usuario_inexistente",
				senha: "senha123",
			}),
		).rejects.toEqual({
			codigo: 401,
			erro: "Não foi possível realizar autenticação",
		});
	});

	it("deve lançar erro quando usuário estiver inativo", async () => {
		const usuarioInativoMock = {
			_id: "507f1f77bcf86cd799439013",
			nome_completo: "Usuário Inativo",
			email: "inativo@example.com",
			nome_usuario: "usuario_inativo",
			cpf: "12345678902",
			numero_registro: "CRF12346",
			senha: "hashed_password",
			dados_administrativos: {
				funcao: "INATIVO",
				entidade_relacionada: "507f1f77bcf86cd799439014",
			},
		};

		(UsuarioRepository.login as jest.Mock).mockResolvedValue({
			usuario: usuarioInativoMock,
			senhaCorreta: true,
		});

		await expect(
			loginService({
				nome_usuario: "usuario_inativo",
				senha: "senha123",
			}),
		).rejects.toEqual({
			codigo: 403,
			erro: "O usuário ainda não foi verificado",
		});

		expect(jwtUtils.generateTokenFromUser).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando geração de token falhar", async () => {
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439015",
			nome_completo: "Usuário Teste",
			email: "usuario@example.com",
			nome_usuario: "usuario_teste",
			cpf: "12345678903",
			numero_registro: "CRF12347",
			senha: "hashed_password",
			dados_administrativos: {
				funcao: "USUARIO",
				entidade_relacionada: "507f1f77bcf86cd799439016",
			},
		};

		(UsuarioRepository.login as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			senhaCorreta: true,
		});

		(jwtUtils.generateTokenFromUser as jest.Mock).mockReturnValue(null);

		await expect(
			loginService({
				nome_usuario: "usuario_teste",
				senha: "senha123",
			}),
		).rejects.toEqual({
			codigo: 403,
			erro: "Usuário inválido",
		});
	});

	it("deve retornar usuario sem campos sensíveis", async () => {
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439017",
			nome_completo: "Usuário Teste",
			email: "usuario@example.com",
			nome_usuario: "usuario_teste",
			cpf: "12345678904",
			numero_registro: "CRF12348",
			senha: "hashed_password",
			token_recuperacao: "recovery_token",
			dados_administrativos: {
				funcao: "GERENTE",
				entidade_relacionada: "507f1f77bcf86cd799439018",
			},
		};

		const tokenMock = "jwt_token_456";

		(UsuarioRepository.login as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			senhaCorreta: true,
		});

		(jwtUtils.generateTokenFromUser as jest.Mock).mockReturnValue(tokenMock);

		const result = await loginService({
			nome_usuario: "usuario_teste",
			senha: "senha123",
		});

		expect(result.usuario.senha).toBeUndefined();
		expect(result.usuario.token_recuperacao).toBeUndefined();
	});
});
