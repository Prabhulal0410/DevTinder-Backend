import mongoose, { Schema } from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  { timestamps: true },
);

// Compound index on fromUserId and toUserId.
// Speeds up queries that search using both fields together.
// Prevents full collection scan and improves performance.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// this is called before we save the data.
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  // check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send request to youself");
  }
  next();
});

export const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
