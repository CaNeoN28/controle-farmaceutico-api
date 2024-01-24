interface Localizacao {
	x: number;
	y: number;
}

interface Referencial {
	identificador: string;
	localizacao: Localizacao;
}

function pontoMaisProximo(localizacao: Localizacao, comparados: Referencial[]) {
	const distancias = comparados.map((c) => {
		const { x: xlocal, y: ylocal } = localizacao;
		const { x: xcomp, y: ycomp } = c.localizacao;

		let distX = xlocal - xcomp;
		distX = distX < 0 ? -distX : distX;

		let distY = ylocal - ycomp;
		distY = distY < 0 ? -distY : distY;

		const distanciaTotal = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

		return {
			identificador: c.identificador,
			distX,
			distY,
			distanciaTotal,
		};
	});

	return distancias;
}

export default pontoMaisProximo;
