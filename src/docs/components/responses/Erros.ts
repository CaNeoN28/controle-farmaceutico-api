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

export { ErroAutenticacao };
