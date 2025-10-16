import express from 'express'
import { PORT } from './config.js'

import companyRoutes from './Routes/company.route.js'
const app = express()

// Usos necesarios
app.use(express.json());

app.use("/CRCUSA", companyRoutes);

app.listen(PORT, () => {
    console.log(`Sevidor escuchando en http://localhost:${PORT}`);
})