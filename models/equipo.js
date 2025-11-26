import { Schema, model } from "mongoose";

const equipmentSchema = Schema({
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    qtty: {
        type: Number
    }
});

const Equipment = model("Equipment", equipmentSchema);

export default Equipment;
