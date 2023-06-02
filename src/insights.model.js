const mongoose = require("mongoose");
const insightSchema = new mongoose.Schema(
  {
    domain: { type: String },
    links: { type: Array },
    media: { type: Array },
    wordCount: { type: Number },
    favourite: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

insightSchema.set("toJSON");

const Insight = mongoose.model("Insight", insightSchema, "Insights");
module.exports = Insight;
