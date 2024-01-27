import { Paths } from "swagger-jsdoc";

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
	"/imagem/{id}": {},
};

export default ImagensPaths;
