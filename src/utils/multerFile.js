import multer from "multer";



const storage = multer.diskStorage({
    destination: function(req, file, cb){
        let fileType = req.body

if(fileType.category == "profile"){

    cb(null,'./src/upload/profile')

}
if(fileType.category == "products"){

    cb(null,'./src/upload/products')

}
if(fileType.category == "domicilio"||fileType.category == "identificacion"||fileType.category == "cuenta"){

    cb(null,'./src/upload/documents')

}
    },

    filename: function (req, file, cb){
        let fileType = req.body

        if(fileType.category == "profile"){
            
            cb(null,"profile"+ "-" + Date.now() +"-"+ file.originalname )
        }
        if(fileType.category == "products"){
            
            cb(null,"product"+ "-" + Date.now() +"-"+ file.originalname )
        }
        if(fileType.category == "domicilio"||fileType.category == "identificacion"||fileType.category == "cuenta"){

            cb(null,"document"+ "-" + Date.now() +"-"+ file.originalname )
        }
    }
})

export const uploadFile = multer({storage:storage})
