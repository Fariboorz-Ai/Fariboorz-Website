"use server";
import { connectDB } from "@/app/db";
import notificationModel from "@/app/models/notificationModel";
export async function markAsRead(_id: string) {
  try {
    const db = await connectDB();
     const findnotif = await notificationModel.findById(_id);
     if (findnotif) {
       await notificationModel.findByIdAndUpdate(
        {
             _id
        },
        {
            isRead: true
        }
       )
         return { success: true };
     }else{
        return { success: false };
     }
  
  } catch (err) {
    console.error("Error updating notification:", err);
    return { success: false };
  }
}
