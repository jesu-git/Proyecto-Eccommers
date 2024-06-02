import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import { fakerES_MX as faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const verificar = (usuario, password) => bcrypt.compareSync(password, usuario.password)

export const mockingCreate = () => {

    let _id = faker.database.mongodbObjectId()
    let title = faker.commerce.productName()
    let description = faker.commerce.productDescription()
    let code = faker.string.numeric({ length: 4 })
    let price = faker.commerce.price({ dec: 0 })
    let status = true
    let stock = faker.string.numeric({ min: 1, max: 300 })
    let category = faker.commerce.productMaterial()
    let thumbnails = []

    
    let product = {
        _id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails

    }

    return product

}