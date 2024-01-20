import Erro from "../../types/Erro";

function deleteUsuarioService(id: string, idGerenciador: string) {
	let erro: Erro | undefined = undefined;
	if (id == idGerenciador) {
		throw {
			codigo: 403,
			erro: "Não é possível remover o próprio usuário",
		};
	}
}

export default deleteUsuarioService;
