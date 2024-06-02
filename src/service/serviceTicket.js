import { TicketManager } from "../dao/class/managerTicket.js";


export class ServiceTicket{

    static async createTicket (ticket){

        return  await TicketManager.tCreate(ticket)


    }
}