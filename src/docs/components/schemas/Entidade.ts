import { Schema } from "swagger-jsdoc";

const EntidadeSchema: Schema = {
	type: "object",
	properties: {
		nome_entidade: {
			type: "string",
			required: true,
			obs: "Deve possuir mais do que 3 caractéres",
		},
		estado: {
			type: "string",
			required: true,
			obs: "Deve ser um estado válido do Brasil",
		},
		municipio: {
			type: "string",
			required: true,
			obs: "Deve ser um município válido do Brasil, estando dentro do estado informado",
		},
		ativo: {
			type: "boolean",
			padrao: true,
		},
	},
};

const EntidadeBadRequest: Schema = {
	type: "object",
	properties: {
		nome_entidade: {
			type: "string",
		},
		estado: {
			type: "string",
		},
		municipio: {
			type: "string",
		},
		ativo: {
			type: "string",
		},
	}
}

export { EntidadeSchema, EntidadeBadRequest };
