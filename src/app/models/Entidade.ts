import mongoose from "mongoose";

const EntidadeSchema = new mongoose.Schema({});

const EntidadeModel = mongoose.model("Entidade", EntidadeSchema);

export default EntidadeModel;
