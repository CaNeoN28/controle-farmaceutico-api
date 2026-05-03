import esqueceuSenhaService from "../../app/services/esqueceu.senha.service";
import UsuarioRepository from "../../app/repositories/Usuario.repository";
import enviarEmail from "../../app/utils/enviarEmail";
import * as jwtUtils from "../../app/utils/jwt";

jest.mock("../../app/repositories/Usuario.repository");
jest.mock("../../app/utils/enviarEmail");
jest.mock("../../app/utils/jwt");
jest.mock("dotenv");

describe("esqueceuSenhaService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve enviar email de recuperação com sucesso", async () => {
		const email = "usuario@example.com";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439011",
			id: "507f1f77bcf86cd799439011",
			nome_usuario: "usuario_teste",
			email: email,
			dados_administrativos: {
				funcao: "USUARIO",
			},
		};

		const tokenMock = "recovery_token_123";

		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);
		(jwtUtils.generateToken as jest.Mock).mockReturnValue(tokenMock);
		(UsuarioRepository.adicionarTokenRecuperacao as jest.Mock).mockResolvedValue(
			true,
		);
		(enviarEmail as jest.Mock).mockResolvedValue(true);

		await esqueceuSenhaService(email);

		expect(UsuarioRepository.findUsuario).toHaveBeenCalledWith({ email });
		expect(jwtUtils.generateToken).toHaveBeenCalledWith(
			{ nome_usuario: usuarioMock.nome_usuario },
			1800,
		);
		expect(UsuarioRepository.adicionarTokenRecuperacao).toHaveBeenCalledWith(
			usuarioMock.id,
			tokenMock,
		);
		expect(enviarEmail).toHaveBeenCalled();
	});

	it("deve lançar erro quando email não for fornecido", async () => {
		await expect(esqueceuSenhaService(undefined)).rejects.toEqual({
			codigo: 400,
			erro: "Email é obrigatório",
		});

		expect(UsuarioRepository.findUsuario).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando email for vazio", async () => {
		await expect(esqueceuSenhaService("")).rejects.toEqual({
			codigo: 400,
			erro: "Email é obrigatório",
		});

		expect(UsuarioRepository.findUsuario).not.toHaveBeenCalled();
	});

	it("deve retornar sem erro quando usuário não for encontrado", async () => {
		const email = "inexistente@example.com";

		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(null);

		await esqueceuSenhaService(email);

		expect(UsuarioRepository.findUsuario).toHaveBeenCalledWith({ email });
		expect(enviarEmail).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando usuário estiver inativo", async () => {
		const email = "inativo@example.com";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439012",
			nome_usuario: "usuario_inativo",
			email: email,
			dados_administrativos: {
				funcao: "INATIVO",
			},
		};

		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);

		await expect(esqueceuSenhaService(email)).rejects.toEqual({
			codigo: 403,
			erro: "O usuário ainda está inativo, espere sua ativação",
		});

		expect(UsuarioRepository.adicionarTokenRecuperacao).not.toHaveBeenCalled();
		expect(enviarEmail).not.toHaveBeenCalled();
	});

	it("deve incluir link de recuperação correto no email", async () => {
		const email = "usuario@example.com";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439013",
			nome_usuario: "usuario_teste",
			email: email,
			dados_administrativos: {
				funcao: "GERENTE",
			},
		};

		const tokenMock = "recovery_token_456";

		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);
		(jwtUtils.generateToken as jest.Mock).mockReturnValue(tokenMock);
		(UsuarioRepository.adicionarTokenRecuperacao as jest.Mock).mockResolvedValue(
			true,
		);
		(enviarEmail as jest.Mock).mockResolvedValue(true);

		await esqueceuSenhaService(email);

		const emailCall = (enviarEmail as jest.Mock).mock.calls[0][0];

		expect(emailCall.assunto).toBe("Link para recuperação de senha");
		expect(emailCall.para).toBe(email);
		expect(emailCall.template).toBe("recoveryEmail");
		expect(emailCall.contexto.recoveryLink).toContain(tokenMock);
		expect(emailCall.contexto.usuario).toBe(usuarioMock.nome_usuario);
	});

	it("deve gerar token com expiração de 30 minutos", async () => {
		const email = "usuario@example.com";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439014",
			nome_usuario: "usuario_teste",
			email: email,
			dados_administrativos: {
				funcao: "USUARIO",
			},
		};

		const tokenMock = "recovery_token_789";

		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);
		(jwtUtils.generateToken as jest.Mock).mockReturnValue(tokenMock);
		(UsuarioRepository.adicionarTokenRecuperacao as jest.Mock).mockResolvedValue(
			true,
		);
		(enviarEmail as jest.Mock).mockResolvedValue(true);

		await esqueceuSenhaService(email);

		expect(jwtUtils.generateToken).toHaveBeenCalledWith(
			{ nome_usuario: usuarioMock.nome_usuario },
			1800
		);
	});

	it("deve enviar email mesmo para usuários com outras funções", async () => {
		const email = "admin@example.com";
		const usuarioMock = {
			_id: "507f1f77bcf86cd799439015",
			nome_usuario: "admin",
			email: email,
			dados_administrativos: {
				funcao: "ADMINISTRADOR",
			},
		};

		const tokenMock = "recovery_token_admin";

		(UsuarioRepository.findUsuario as jest.Mock).mockResolvedValue(usuarioMock);
		(jwtUtils.generateToken as jest.Mock).mockReturnValue(tokenMock);
		(UsuarioRepository.adicionarTokenRecuperacao as jest.Mock).mockResolvedValue(
			true,
		);
		(enviarEmail as jest.Mock).mockResolvedValue(true);

		await esqueceuSenhaService(email);

		expect(enviarEmail).toHaveBeenCalled();
		expect(UsuarioRepository.adicionarTokenRecuperacao).toHaveBeenCalled();
	});
});
