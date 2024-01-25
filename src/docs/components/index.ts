import { Components } from "swagger-jsdoc";
import {} from "./Autenticacao";
import {} from "./Entidade";
import {} from "./Farmacia";
import {} from "./Usuario";
import { BearerAuth } from "./BearerAuth";

const components: Components = {
	schemas: {},
	securitySchemes: {
		BearerAuth,
	},
};

export default components;
