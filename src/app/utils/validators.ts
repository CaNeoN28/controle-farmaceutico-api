import mongoose from "mongoose";

function validarID<T>(v: T) {
	return mongoose.isValidObjectId(v);
}

function validarEmail(v: string) {
	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

	return regex.test(v);
}

function validarNomeDeUsuario(v: string) {
	const regex = /^(?=.{3,}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

	return regex.test(v);
}

export { validarID, validarEmail };
