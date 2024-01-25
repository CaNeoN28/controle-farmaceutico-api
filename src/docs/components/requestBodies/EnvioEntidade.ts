import { RequestBody } from "swagger-jsdoc";

const EnvioEntidade: RequestBody = {
	content: {
		"application/json": {
			schema: { $ref: "#/components/schemas/Entidade" },
			example: {
				nome_entidade: "Ministério da Saúde",
				municipio: "Vilhena",
				estado: "Rondônia",
				ativo: true,
			},
		},
	},
};

export default EnvioEntidade;
