"use server";
import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types/typesData";

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNumber: String,
    location: {
        latitude: Number,
        longitude: Number,
    },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;