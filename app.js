import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

app.get('/api/products/', (req, res) => {
    console.log("entro a la ruta home actualizada")
    res.send('Hello World!')
})

app.post('/api/products/', (req, res) => {
    console.log("entro a la ruta home de post")
    const products = [
        { name: "camara profesional", id: "1" },
        { name: "micro profesional", id: "2" },

    ]
    res.json({"productos": products})
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
