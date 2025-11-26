import { Schema, model } from "mongoose";

const reserveSchema = Schema({
    equipment_id: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment'
    },
    qtty: {
        type: Number
    },
    user_id: Schema.Types.ObjectId,
    // FIXME: agregar funcionalidad de tabla de users
    // user_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Users' // como sea que la llamen lol
    // },
    approved: Boolean,
    startDate: Date,
    endDate: Date
});

const Reserve = model("Reserve", reserveSchema);

export default Reserve;
