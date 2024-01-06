import mongoose from "mongoose";
import validarCPF from "../utils/validarCPF";

const DatosAdministrativosSchema = new mongoose.Schema({})

const UsuarioSchema = new mongoose.Schema({});

const Usuario = mongoose.model("Usuario", UsuarioSchema)

export default Usuario