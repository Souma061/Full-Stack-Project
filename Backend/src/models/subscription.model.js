import mongoose from 'mongoose';


const subscriptionSchema = new mongoose.Schema({
  channel: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  subscriber: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true});


export const Subscription = mongoose.model("Subscription", subscriptionSchema);


// to count the subscribers of a channel we don't neeed to create an array of subscribers inside the user model insted of we can just count the number of subscription documents for a particular channel
// this approach is more scalable and efficient as the number of subscribers grows
// we can use mongoose aggregate function to count the number of subscribers for a channel



// to found the number of subscribed channel by a user we can count the number of subscription documents where the subscriber field is equal to the user id
// this approach is more efficient as we don't need to store an array of subscribed channels inside the user model
// we can use mongoose aggregate function to count the number of subscribed channels by a user
