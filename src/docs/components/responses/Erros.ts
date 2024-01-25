import { Response } from "swagger-jsdoc";

const ErroAutenticacao: Response = {
	description: "Retorna erro ao tentar usar a rota sem autenticação",
	content: {
		"text/html": {
			schema: {
				type: "text",
				example: "É necessário estar autenticado para usar esta rota",
			},
		},
	},
};

const ErroNaoGerente: Response = {
	description: "Retorna erro ao autenticar com um usuário que não é gerente",
	content: {
		"text/html": {
			schema: {
				type: "text",
				example: "É necessário ser gerente ou superior para realizar esta ação",
			},
		},
	},
};

const ErroInterno: Response = {
	description: "Retorna um erro não esperado pela API",
	content: {
		"text/html": {
			schema: {
				type: "text",
				example: "Erro interno do servidor",
			},
		},
	},
};

export { ErroAutenticacao, ErroNaoGerente, ErroInterno };
