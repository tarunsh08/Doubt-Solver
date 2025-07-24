import inngest from "../client";
import Ticket from "../../models/ticket.model.js"
import User from "../../models/user.model.js"
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer";
import analyzeTicket from "../../utils/ai-provider.js";

export const onTicketCreated = inngest.createFunction(
    {id: "on-ticket-created", retries: 2},
    {event: "ticket/created"},

    async({event, step}) => {
        try {
            const {ticketId} = event.data

            const ticket = await step.run("fetch-ticket", async() => {
                const ticketObject = await Ticket.findById(ticketId)
                if(!ticketObject){
                    throw new NonRetriableError("Ticket no longer exists")
                }
                return ticketObject
            })

            await step.run("update-ticket-status", async() => {
                await Ticket.findByIdAndUpdate(ticket._id, {status: "TODO"})
            })

            const aiResponse = await analyzeTicket(ticket)

            const relatedSkills = await step.run("ai-processing", async() => {
                let skills = []
                if(aiResponse){
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: !["low", "medium", "high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status: "IN_PROGRESS",
                        relatedSkills: aiResponse.relatedSkills
                    })
                    skills = aiResponse.relatedSkills
                }
                return skills
            })

            const moderator = await step.run("assign-moderator", async() => {
                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i"
                        }
                    }
                })
                if(!user){
                    user = await User.findOne({
                        role: "admin",
                    })
                }
                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null
                })
                return user
            })
            
            await step.run("send-email-notification", async() => {
                if(moderator){
                    const finalTicket = await Ticket.findById(ticket._id)
                    await sendMail(
                        moderator.email,
                        "Ticket assigned",
                        `A new ticket has been assigned to you.\n\n
                        Ticket Title: ${finalTicket.title}\n
                        Ticket Description: ${finalTicket.description}\n
                        Ticket Priority: ${finalTicket.priority}\n
                        Ticket Deadline: ${finalTicket.deadline}\n
                        Ticket Related Skills: ${finalTicket.relatedSkills.join(", ")}\n
                        Ticket Created By: ${finalTicket.createdBy}\n
                        Ticket Assigned To: ${finalTicket.assignedTo}`
                    )
                }
            })

            return {success: true}
        } catch (err) {
            console.error("Error running step", err.message)
            return {success: false}
        }
    }
)