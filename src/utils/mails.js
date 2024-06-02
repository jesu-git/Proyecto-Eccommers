import nodemailer from 'nodemailer'
import { config } from '../config/config.js'


const transport = nodemailer.createTransport({

    service: "gmail",
    port: 587,
    auth:{

        user: config.userEmail,
        pass: config.emailPass
    }
})


export let sendEmail = async (to,subject,message)=>{

    return await transport.sendMail({

        to,
        subject,
        html: message
    })
}

