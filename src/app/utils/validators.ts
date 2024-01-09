import mongoose from "mongoose";

function validarID<T> (v: T) {
	return mongoose.isValidObjectId(v)
}

export {
	validarID
}