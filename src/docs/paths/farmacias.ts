import { Paths } from "swagger-jsdoc";

const FarmaciasPaths: Paths = {
	"/farmacia": {
	},
	"/farmacia/{id}": {
		parameters: {
			name: "id",
			in: "path",
			required: true,
			description: "ID da farmácia",
		},
	},
	"/farmacias": {
	},
	"/farmacia/proxima": {
	},
	"/farmacias/plantao": {
	},
};

export default FarmaciasPaths;
