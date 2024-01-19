import TokenData from "../../types/TokenData";

async function updateUsuarioService(id: string, data: any, user: TokenData) {
	if (user.id === id) {
		throw {
			codigo: 403,
			erro: "Não é possível alterar seus próprios dados usando esta rota",
		};
	}
}

export default updateUsuarioService;
