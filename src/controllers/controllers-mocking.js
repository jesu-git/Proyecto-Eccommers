import { mockingCreate } from "../utils.js"


export class ControllerMocking{ 
    
    
static async mocking(req, res) {

    let products = []

    for (let i = 0; i <= 100; i++) {

        let product = mockingCreate()

        products.push(product)


    }
    res.setHeader('Content-Type','application/json')
    res.status(200).send(products) 
}
static async winston (req,res){

    req.logger.fatal("ERROR, el error ha sido fatal!")
    req.logger.error("ERROR, se ha producido un error en el proceso!")
    req.logger.warning("warning, advertencia los datos son incorrectos o hay faltantes!")
    req.logger.info("informe")
    req.logger.http("ERROR, errores en el sector http!")
    req.logger.debug("Se ha detectado un debug")

    res.status(200).render("winston")
}
}