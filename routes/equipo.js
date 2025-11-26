import express from "express";
import Equipment from "../models/equipo.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  if (!req.body.name || !req.body.description || !req.body.qtty) {
    next(new Error("Name, qtty and description required"));
    return;
  }

  const { name, description, qtty } = req.body;

  try {
    const new_equipment = new Equipment({
      name,
      description,
      qtty
    });

    await new_equipment.save();

    res.status(201).json(new_equipment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const found = await Equipment.findById(id);

    res.status(200).json(found);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const found = await Equipment.find();

    res.status(200).json(found);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
