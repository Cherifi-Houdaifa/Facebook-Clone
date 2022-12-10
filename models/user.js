const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    username: { type: Schema.Types.String, unique: true, required: true },
    profilePic: {
        type: Schema.Types.String,
        required: true,
        default: "https://i.ibb.co/18Ctbn6/default.jpg",
    },
    friends: [
        {
            friend: { type: Schema.Types.ObjectId, ref: "User" },
            status: {
                type: Schema.Types.String,
                enum: ["requested", "pending", "friends"],
            },
        },
    ],
    password: { type: Schema.Types.String },
    googleid: { type: Schema.Types.String },
});

module.exports = model("User", UserSchema);
