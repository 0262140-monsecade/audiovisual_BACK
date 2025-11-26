import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerEquipment from "./routes/equipo.js"
import authRouter from "./routes/auth.js"     
import routerReservations from "./routes/reservations.js"
import { erorrHandler } from './middleware/errors.js'
import connectionMongoDB from './config/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

/////////////conexion a mongo//////////
connectionMongoDB();
//////////////////////////////////////

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.use('/api/equipment', routerEquipment);
app.use('/api/reservation', routerReservations);
app.use('/api/auth', authRouter);            


app.use(erorrHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on http://127.0.0.1:${PORT}/`)
})
