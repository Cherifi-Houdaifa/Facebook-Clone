const { model, Schema } = require("mongoose");

const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: Schema.Types.String, required: true },
    img: { type: Schema.Types.Buffer },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    date: { type: Schema.Types.Date, required: true },
});

module.exports = model("Post", PostSchema);
