import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerProduct from './routes/routesProducts.js'
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

app.use('/api/products', routerProduct);

app.use(erorrHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
