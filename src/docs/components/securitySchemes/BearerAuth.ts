import { SecurityScheme } from "swagger-jsdoc";

const BearerAuth: SecurityScheme = {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
};

export { BearerAuth};
