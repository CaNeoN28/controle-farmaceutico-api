import { Components } from "swagger-jsdoc";
import {} from "./Autenticacao";
import { EntidadeBadRequest, EntidadeSchema } from "./Entidade";
import {} from "./Farmacia";
import {} from "./Usuario";
import { BearerAuth } from "./BearerAuth";

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
