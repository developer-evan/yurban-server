import mongoose, { Document, Schema } from "mongoose";

interface RideDocument extends Document {
  customerId: mongoose.Types.ObjectId; // Reference to Customer
  driverId: mongoose.Types.ObjectId; // Reference to Driver
  pickupLocation: string;
  dropoffLocation: string;
  passengerNumber: number;
  status: "Pending" | "Accepted" | "Rejected"; // Default to "Pending"
  requestedAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
}

const rideSchema = new Schema<RideDocument>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    passengerNumber: { type: Number, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
  },
  { timestamps: true }
);

const RideModel = mongoose.model<RideDocument>("Ride", rideSchema);
export default RideModel;
