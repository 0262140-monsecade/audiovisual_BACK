import express  from "express"
import dotenv from "dotenv"
import routerProducts from "./routes/routesProducts.js";

dotenv.config()
const app = express()
const port = Number(process.env.PORT) || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/routesProducts", routerProducts);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})