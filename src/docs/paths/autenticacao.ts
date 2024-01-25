import { Paths } from "swagger-jsdoc";

const AutenticacaoPaths: Paths = {
	"/login": {
		post: {
			tags: ["Autenticação"],
			summary: "Realiza login e retorna token de autenticação",
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								nome_usuario: {
									type: "string",
								},
								senha: {
									type: "string",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Retorna os dados de usuário e o token de autenticação",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									usuario: {
										$ref: "#/components/schemas/UsuarioGet",
									},
									token: {
										type: "string",
									},
								},
							},
						},
					},
				},
				401: {
					description: "Erro informado ao informar dados incorretos",
					content: {
						"text/html": {
							schema: {
								type: "string",
							},
						},
					},
				},
				403: {
					description:
						"Erro de não autorização, por conta do usuário inativo pelo token não poder ser gerado",
					content: {
						"text/html": {
							schema: {
								type: "string",
							},
						},
					},
				},
			},
		},
	},
};

export default AutenticacaoPaths;
