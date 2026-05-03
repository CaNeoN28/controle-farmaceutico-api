import findUsuarioService from "../../app/services/find.usuario.service";
import UsuarioRepository from "../../app/repositories/Usuario.repository";

jest.mock("../../app/repositories/Usuario.repository");

describe("findUsuarioService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve encontrar usuario com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const usuarioMock = {
			_id: id,
			nome_completo: "Usuário Teste",
			email: "usuario@example.com",
			nome_usuario: "usuario_teste",
			cpf: "12345678901",
			numero_registro: "CRF12345",
		};

		(UsuarioRepository.findUsuarioId as jest.Mock).mockResolvedValue(usuarioMock);

		const result = await findUsuarioService(id);

		expect(result).toEqual(usuarioMock);
		expect(UsuarioRepository.findUsuarioId).toHaveBeenCalledWith(id);
	});

	it("deve lançar erro quando usuario não for encontrado", async () => {
		const id = "507f1f77bcf86cd799439012";

		(UsuarioRepository.findUsuarioId as jest.Mock).mockResolvedValue(null);

		await expect(findUsuarioService(id)).rejects.toEqual({
			codigo: 404,
			erro: "Usuário não encontrado",
		});
	});

	it("deve lançar erro quando id for inválido", async () => {
		const id = "invalid_id";
		const erroMock = {
			codigo: 400,
			erro: "Id inválido",
		};

		(UsuarioRepository.findUsuarioId as jest.Mock).mockRejectedValue(erroMock);

		await expect(findUsuarioService(id)).rejects.toEqual(erroMock);
	});

	it("deve lançar erro de database quando repository falhar", async () => {
		const id = "507f1f77bcf86cd799439013";
		const erroMock = {
			codigo: 500,
			erro: "Erro ao conectar com o banco de dados",
		};

		(UsuarioRepository.findUsuarioId as jest.Mock).mockRejectedValue(erroMock);

		await expect(findUsuarioService(id)).rejects.toEqual(erroMock);
	});

	it("deve retornar usuario com informações completas", async () => {
		const id = "507f1f77bcf86cd799439014";
		const usuarioMock = {
			_id: id,
			nome_completo: "João Silva",
			email: "joao@example.com",
			nome_usuario: "joao_silva",
			cpf: "98765432100",
			numero_registro: "CRF98765",
			dados_administrativos: {
				funcao: "GERENTE",
				entidade_relacionada: "507f1f77bcf86cd799439015",
			},
		};

		(UsuarioRepository.findUsuarioId as jest.Mock).mockResolvedValue(usuarioMock);

		const result = await findUsuarioService(id);

		expect(result).toEqual(usuarioMock);
	});
});
