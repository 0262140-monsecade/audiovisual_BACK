import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerProduct from './routes/routesProducts.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

//app.use('/api/products', routerProduct)

app.get('/', (req, res) => {
    console.log("entro a la ruta home actualizada")
    res.send('Hello World!')
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
