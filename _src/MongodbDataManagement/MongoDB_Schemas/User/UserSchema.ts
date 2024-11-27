// Mongoose
import mongoose from "mongoose";
// Mongoose

export type T_UserSchema = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  userToken: string;
  refreshToken: string;
  userId: string;
  isRegisterCompleted: boolean;
  role: "ADMIN" | "NORMAL_USER";
  loginTryCount: number;
  bpmnTryCount: number;
  formIoTryCount: number;
  requestIp: string;
};

export const UserSchema = new mongoose.Schema<T_UserSchema>({
  name: String,
  lastName: String,
  email: String,
  password: String,
  userToken: String,
  refreshToken: String,
  userId: String,
  isRegisterCompleted: Boolean,
  loginTryCount: Number,
  bpmnTryCount: Number,
  formIoTryCount: Number,
  requestIp: String,
  role: String, // ADMIN | NORMAL_USER
});
