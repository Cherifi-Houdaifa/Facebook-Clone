const { model, Schema } = require("mongoose");

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: Schema.Types.String, required: true },
});

module.exports = model("Comment", CommentSchema);
