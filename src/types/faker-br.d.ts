type stringF = () => string;

declare module "faker-br" {
	const company: {
		companyName: stringF;
	};
	const br: {
		cpf: stringF;
		cnpj: stringF;
	};
	const internet: {
		email: stringF;
		userName: stringF;
	};
	const name: {
		firstName: stringF;
		lastName: stringF;
	};
	const address: {
		streetName: stringF;
		latitude: () => number;
		longitude: () => number;
	};
	const date: {
		future: () => Date;
	};
}
