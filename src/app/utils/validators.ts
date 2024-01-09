import mongoose from "mongoose";

function validarID<T> (v: T) {
	return mongoose.isValidObjectId(v)
}

function validarEmail (v: string) {
	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

	return regex.test(v)
}

export {
	validarID,
	validarEmail
}