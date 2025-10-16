import { Router } from "express";
import { deleteCompany, getAllCompanies, getCompaniesByContact, getCompanyById, postCreateCompany, putEditCompany } from "../controllers/company.controller";

const router = Router();

/*
R6: CRUD completo en conjunto de todos los endpoints
R7: Se pasan los datos en crudo y los proceso, se hace un ENDPOINT donde se pasan los datos o un CSV, se va iterando y guardando los datos
R8: Se gestionan los duplicados con funciones aparte que se llaman dentro de los POST y PUT que se les hacen a las companias
R9: Se guardan las coordenadas o direccion exacta y se retornan para que el Frondted resuelva
R10: Es una relacion de 1 -> *, entonces las empresas tendrian un espacio del ID del dueno, para poder referenciarlas

*/

router.post('/createCompany', postCreateCompany) // Crear una nueva empresa
router.get('/getAllCompanies', getAllCompanies) //Obtener todas las empresas
router.get('/getCompanyById/:id', getCompanyById) //Obtener empresa por ID
router.get('/getCompaniesByContact/:id', getCompaniesByContact) //Obtener la empresa por medio de la relacion con el contacto
router.put('/editCompany/:id', putEditCompany) //Editar la empresa
router.delete('/deleteCompany/:id', deleteCompany) //Elimninar la empresa (borrado logico o no??)

export default router;