import mongoose from "mongoose";

const FarmaciaSchema = new mongoose.Schema({});

const FarmaciaModel = mongoose.model("Farmacia", FarmaciaSchema);

export default FarmaciaModel;
