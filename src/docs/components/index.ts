import { Components } from "swagger-jsdoc";
import {} from "./schemas/Autenticacao";
import { EntidadeBadRequest, EntidadeSchema } from "./schemas/Entidade";
import {} from "./schemas/Farmacia";
import {} from "./schemas/Usuario";
import { BearerAuth } from "./securitySchemes/BearerAuth";
import { ErroAutenticacao } from "./responses/Erros";
import EnvioEntidade from "./requestBodies/EnvioEntidade";

const components: Components = {
	schemas: {
		Entidade: EntidadeSchema,
		EntidadeBadRequest: EntidadeBadRequest,
	},
	requestBodies: {
		Entidade: EnvioEntidade,
	},
	responses: {
		ErroAutenticacao: ErroAutenticacao,
	},
	securitySchemes: {
		BearerAuth,
	},
};

export default components;
