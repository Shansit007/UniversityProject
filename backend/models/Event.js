const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' }
}, { timestamps: true });
