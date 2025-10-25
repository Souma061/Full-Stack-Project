import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 280
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  retweetsCount: {
    type: Number,
    default: 0,
  },
  repliesCount: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  }]

},{timestamps:true});

export const Tweet = mongoose.model("Tweet", tweetSchema);
