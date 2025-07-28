import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
    title: String,
    description: String,
    // status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    createdBy:{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    assignedTo:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
    priority: String,
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
    createdAt: {type: Date, default: Date.now}
})

export default mongoose.model("Ticket", ticketSchema)