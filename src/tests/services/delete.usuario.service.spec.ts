import deleteUsuarioService from "../../app/services/delete.usuario.service";
import UsuarioRepository from "../../app/repositories/Usuario.repository";
import ImagemRepository from "../../app/repositories/Imagem.repository";

jest.mock("../../app/repositories/Usuario.repository");
jest.mock("../../app/repositories/Imagem.repository");

describe("deleteUsuarioService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve deletar usuario com sucesso", async () => {
		const id = "507f1f77bcf86cd799439011";
		const idGerenciador = "507f1f77bcf86cd799439012";
		const usuarioMock = {
			_id: id,
			id: id,
			nome_completo: "Usuário Teste",
			imagem_url: undefined,
		};

		(UsuarioRepository.deleteUsuario as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			erro: undefined,
		});

		await deleteUsuarioService(id, idGerenciador);

		expect(UsuarioRepository.deleteUsuario).toHaveBeenCalledWith(id, idGerenciador);
		expect(ImagemRepository.removerImagem).not.toHaveBeenCalled();
	});

	it("deve deletar usuario e remover imagem quando existir", async () => {
		const id = "507f1f77bcf86cd799439013";
		const idGerenciador = "507f1f77bcf86cd799439014";
		const usuarioMock = {
			_id: id,
			id: id,
			nome_completo: "Usuário Com Imagem",
			imagem_url: "usuario_123.jpg",
		};

		(UsuarioRepository.deleteUsuario as jest.Mock).mockResolvedValue({
			usuario: usuarioMock,
			erro: undefined,
		});

		await deleteUsuarioService(id, idGerenciador);

		expect(UsuarioRepository.deleteUsuario).toHaveBeenCalledWith(id, idGerenciador);
		expect(ImagemRepository.removerImagem).toHaveBeenCalledWith(
			"usuario",
			id,
			"usuario_123.jpg",
		);
	});

	it("deve lançar erro quando tentar deletar o próprio usuário", async () => {
		const id = "507f1f77bcf86cd799439015";
		const idGerenciador = id; // mesmo id

		await expect(deleteUsuarioService(id, idGerenciador)).rejects.toEqual({
			codigo: 403,
			erro: "Não é possível remover o próprio usuário",
		});

		expect(UsuarioRepository.deleteUsuario).not.toHaveBeenCalled();
		expect(ImagemRepository.removerImagem).not.toHaveBeenCalled();
	});

	it("deve lançar erro quando repository retornar erro", async () => {
		const id = "507f1f77bcf86cd799439016";
		const idGerenciador = "507f1f77bcf86cd799439017";
		const erroMock = {
			codigo: 404,
			erro: "Usuário não encontrado",
		};

		(UsuarioRepository.deleteUsuario as jest.Mock).mockResolvedValue({
			usuario: null,
			erro: erroMock,
		});

		await expect(deleteUsuarioService(id, idGerenciador)).rejects.toEqual(erroMock);
	});

	it("deve lançar erro de permissão quando tentar deletar outro gerenciador", async () => {
		const id = "507f1f77bcf86cd799439018";
		const idGerenciador = "507f1f77bcf86cd799439019";
		const erroMock = {
			codigo: 403,
			erro: "Você não tem permissão para remover este usuário",
		};

		(UsuarioRepository.deleteUsuario as jest.Mock).mockResolvedValue({
			usuario: null,
			erro: erroMock,
		});

		await expect(deleteUsuarioService(id, idGerenciador)).rejects.toEqual(erroMock);
	});
});
