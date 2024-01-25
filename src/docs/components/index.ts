import { Components } from "swagger-jsdoc";
import {} from "./schemas/Autenticacao";
import { EntidadeBadRequest, EntidadeSchema } from "./schemas/Entidade";
import {} from "./schemas/Farmacia";
import {} from "./schemas/Usuario";
import { BearerAuth } from "./securitySchemes/BearerAuth";

const components: Components = {
	schemas: {
		Entidade: EntidadeSchema,
		EntidadeBadRequest: EntidadeBadRequest,
	},
	requestBodies: {},
	securitySchemes: {
		BearerAuth,
	},
};

export default components;
