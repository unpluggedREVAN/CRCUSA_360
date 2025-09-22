import express from 'express'
import { PORT } from './config.js'

const app = express()

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor Noidejs corrriendo");
});

app.listen(PORT, () => {
    console.log(`Sevidor escuchando en http://localhost:${PORT}`);
})