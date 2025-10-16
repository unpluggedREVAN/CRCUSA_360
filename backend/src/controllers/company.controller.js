// Definir la conexio con la base de datos

export const getAllCompanies = async (req, res) => {
    return res.status(200).json("Obtener todas las empresas")
}

export const postCreateCompany = async (req, res) => {
    return res.status(200).json("Crear una empresa")
}

export const getCompanyById = async (req, res) => {
    return res.status(200).json("Obtener la informacion de una empresa por ID")
}

export const getCompaniesByContact = async (req, res) => {
    return res.status(200).json("Obtener la informacion de las empresas del contactos")
}

export const putEditCompany = async (req, res) => {
    return res.status(200).json("Editar la empresa")
}

export const deleteCompany = async (req, res) => {
    return res.status(200).json("Eliminar la empresa")
}