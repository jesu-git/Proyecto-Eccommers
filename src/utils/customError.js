

export class ManejoErrores {

    static manejo(nombre, mensaje, code, descripcion) {

        let error = new Error(mensaje)
        error.name = nombre
        error.code = code
        error.descripcion = descripcion

        return error
    }
}