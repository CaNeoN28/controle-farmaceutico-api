import { Application } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition: swaggerJsDoc.OAS3Definition = {
	openapi: "3.0.0",
	info: {
		title: "API Plataforma de controle de plantão farmacêutico",
		version: "1.0",
	},
	servers: [
		{
			url: "http://localhost:3030",
			description: "Ambiente de desenvolvimento",
		},
	],
	security: [
		{
			bearerAuth: [],
		},
	],
};

const swaggerOptions: swaggerJsDoc.Options = {
	apis: [],
	definition: swaggerDefinition,
};

export default function swaggerSetup(app: Application) {
	const swaggerDoc = swaggerJsDoc(swaggerOptions);

	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}
