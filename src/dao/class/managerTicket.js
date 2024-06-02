import { ticketModel } from "../models/ticketModel.js"


export class TicketManager {


    static async tCreate(ticket){
      try {

          return await ticketModel.create(ticket)
        
      } catch (error) {

        console.log("No se pudo crear su ticket")
        
      }
    }
    static async getTicket(){

      return await ticketModel.find().lean()
    }
}