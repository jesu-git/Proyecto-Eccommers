

export const errorDataInsert = () => {

    return `ERROR, no se han insertado todos los campos minimos requeridos.
           Campos requeridos:
        
           - title: 'string'
           - description: 'string'
           - code: 'string'
           - price: 'number'
           - status: 'boolean'
           - stock: 'number'
           - category: 'string'`

}
export const errorLogueo = () => {

    return 'Error de logueo: Para acceder debes logueartes antes.'
}
export const errorConflict = ()=>{

    return ` Conflicto en la creacion o actualizacion de informacion, posibles motivos:
    
               -Usuario o producto ya existente.
               - Conflicto con la informacion.`
}
export const errorRequest = ()=>{

    return `Error de peticion, request mal realizada o datos incorrectos. `
}