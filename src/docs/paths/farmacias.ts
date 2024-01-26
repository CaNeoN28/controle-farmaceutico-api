import { Paths } from "swagger-jsdoc";

const FarmaciasPaths: Paths = {
	"/farmacia": {
		post: {},
	},
	"/farmacia/{id}": {
		parameters: {
			name: "id",
			in: "path",
			required: true,
			description: "ID da farmácia",
		},
		get: {},
		put: {},
		delete: {},
	},
	"/farmacias": {
		get: {},
	},
	"/farmacia/proxima": {
		get: {},
	},
	"/farmacias/plantao": {
		get: {},
	},
};

export default FarmaciasPaths;
