import express from "express";
import Reservation from "../models/reservation.js";
import Equipment from "../models/equipo.js";

const router = express.Router();

async function checkEquipmentAvailable(equipment_id, qtty, startDate, endDate) {
  try {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (s > e) throw new Error("Start date must be earlier than end date");

    const reservations = await Reservation.find({
      equipment_id,
      startDate: { $lte: e },
      endDate: { $gte: s },
      approved: { $eq: true },
    });
    const reservedCount = reservations.reduce(
      (acc, item) => acc + (item.qtty ?? 0),
      0
    );

    const equipment = await Equipment.findById(equipment_id);
    const total = equipment.qtty;
    const remaining = total - reservedCount;

    if (remaining < qtty) {
      console.log("not enough items");
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

// INFO: crear reservacion
router.post("/", async (req, res, next) => {
  if (
    !req.body.qtty ||
    !req.body.equipment_id ||
    !req.body.startDate ||
    !req.body.endDate ||
    !req.body.userId
  ) {
    next(new Error("Missing fields!\n"));
    return;
  }

  const { qtty, equipment_id, startDate, endDate, userId } = req.body;

  try {
    if (
      !(await checkEquipmentAvailable(equipment_id, qtty, startDate, endDate))
    )
      throw new Error("Equipment not available");

    const new_reservation = new Reservation({
      equipment_id,
      startDate,
      endDate,
      qtty,
      user_id: userId, // TODO: tabla de usuarios con ids (google?)
      approved: false,
    });

    await new_reservation.save();

    res.status(201).json(new_reservation);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// INFO: obtener todas las reservaciones de un usuario
router.get("/user/:user_id", async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const user_reservations = await Reservation.find({
      user_id: { $eq: user_id },
    });

    res.status(201).json(user_reservations);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// INFO: obtener reservacion especifica
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const found = await Reservation.findById(id);

    res.status(200).json(found);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// INFO: obtener todas las reservaciones
router.get("/", async (req, res, next) => {
  try {
    const found = await Reservation.find();

    res.status(200).json(found);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// INFO: aprovar reservaciones si eres administrador y si hay availability
router.patch("/accept/:reserve_id", async (req, res, next) => {
  const { reserve_id } = req.params;
  // const { admin_id } = req.body; // el que esta mandando la peticion

  try {
    // TODO:
    // if (!admin_id || (await Users.findById(admin_id)).type !== "admin") throw new Error("You must be admin to perform this action");
    const { qtty, equipment_id, startDate, endDate } = await Reservation.findById(reserve_id);

    if (
      !(await checkEquipmentAvailable(equipment_id, qtty, startDate, endDate))
    )
      throw new Error("Equipment not available");

    await Reservation.updateOne({ _id: reserve_id }, { $set: { approved: true } });

    res.status(200).send("success!");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
