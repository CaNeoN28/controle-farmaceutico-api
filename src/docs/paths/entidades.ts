import { Paths } from "swagger-jsdoc";

const EntidadesPaths: Paths = {
	"/entidade/{id}": {
		get: {
			tags: ["Entidades"],
			parameters: [
				{
					name: "id",
					description: "ID da entidade cadastrada",
					in: "path",
					required: true,
				},
			],
			responses: {
				200: {
					description: "Recupera uma entidade cadastrada usando seu ID",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Entidade"
							}
						}
					}
				},
				400: {
					description: "Retornar erro ao informar um id inválido",
				}
			},
		},
	},
};

export default EntidadesPaths;
