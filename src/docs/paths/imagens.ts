import { Paths } from "swagger-jsdoc";

const ParametrosId = [
	{
		name: "id",
		in: "path",
		description: "Nome da imagem, informado pela rota de envio",
		required: true,
		schema: {
			type: "string",
		},
	},
];

const ImagensPaths: Paths = {
	"/imagem": {
		post: {
			tags: ["Imagens"],
			summary: "Envia uma imagem",
			description:
				"Envia várias imagens e retorna seus caminhos na API. É preciso estar autenticado.",
			security: [{ BearerAuth: [] }],
			requestBody: {
				content: {
					"multipart/form-data": {
						schema: {
							type: "object",
							properties: {
								imagem: {
									type: "array",
									items: {
										type: "string",
										format: "binary",
									},
								},
							},
						},
					},
				},
			},
			responses: {
				201: {
					description: "Salva as imagens e retorna seu endereço na API",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									nome_da_imagem: {
										type: "string",
									},
								},
							},
						},
					},
				},
				400: {
					description: "Retorna erros se não for possível salvar imagem",
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
	},
	"/imagem/{id}": {
		get: {
			tags: ["Imagens"],
			summary: "Recupera uma imagem da API",
			description:
				"Retorna uma imagem enviada à API. Seu nome funciona como ID, nas não é a mesma coisa.",
			security: [],
			parameters: ParametrosId,
			responses: {
				200: {
					description: "Retorna a imagem com sucesso",
					content: {
						"image/png": {},
						"image/jpg": {},
						"image/jpeg": {},
					},
				},
				404: {
					description: "Retorna erro se a imagem não for encontrada",
					content: {
						"text/html": {},
					},
				},
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
		delete: {
			tags: ["Imagens"],
			summary: "Remove uma imagem da API",
			description:
				"Remove uma imagem da API pelo seu nome. É preciso estar autenticado.",
			security: [{ BearerAuth: [] }],
			parameters: ParametrosId,
			responses: {
				204: {
					description: "Remove com sucesso a imagem",
				},
				401: {
					$ref: "#/components/responses/ErroAutenticacao",
				},
				404: {
					description: "Retorna erro se não for possível encontrar a imagem",
					content: {
						"text/html": {
							schema: {
								type: "string",
								example: "Imagem não encontrada",
							},
						},
					},
				},
				500: {
					$ref: "#/components/responses/ErroInterno",
				},
			},
		},
	},
};

export default ImagensPaths;
