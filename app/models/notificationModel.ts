import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    type: { 
        type: String, 
        enum: ['trade', 'signal', 'system', 'alert', 'custom'], 
        default: 'system' 
    },
    title: { type: String, required: true }, 
    message: { type: String, required: true },
    tradeId: { type: Schema.Types.ObjectId, ref: 'Trade', default: null }, 
    signalId: { type: Schema.Types.ObjectId, ref: 'Signal', default: null }, 
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const NotificationModel =
  mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default NotificationModel;