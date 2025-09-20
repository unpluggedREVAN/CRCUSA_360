const express = require("express");
const app = express()

const PORT = 3000 //Local port

//Midleware para parsea Json

app.get("/", (req, res) => {
    res.send("Servidor corriendo")
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`)
})