import mongoose, { Document, Schema } from 'mongoose';

export interface UserInterface extends Document {
  uid: string; 
  name: string;
  email: string;
  password: string;
  role: 'ROOT' | 'ADMIN' | 'MEMBER';

  exchange: {
    name: 'bitunix' | 'bingx';
    apiKey: string;
    apiSecret: string;
    isActive: boolean;
  } | null;

  telegram: {
    chatId: string;
    token: string; 
    isActive: boolean;
  } | null;

  trade_settings: {
    strategyId: mongoose.Types.ObjectId | null;
    leverage: number;
    marginType: 'cross' | 'isolated';
    margin: number;
    tradeLimit: number; 
    isActive: boolean;
  };

  trades_history: mongoose.Types.ObjectId[];

  notifications: {
    history: mongoose.Types.ObjectId[];
    isActive: boolean;
  };

  settings: {
    timezone: string;
    language: 'fa' | 'en';
  };

  security: {
    loginHistory: {
      ip: string;
      device: string;
      date: Date;
    }[];
  };

  subscription: {
    plan: 'free' | 'pro' | 'vip';
    expiryDate: Date | null;
  };

  isBanned: boolean;
  lastLogin: Date;
}

const userSchema = new Schema<UserInterface>(
    {
        uid: { type: String, required: true, unique: true, minlength: 11, maxlength: 11 },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: ['ROOT', 'ADMIN', 'MEMBER'],
            default: 'MEMBER',
        },

        exchange: {
            name: { type: String, enum: ['bitunix', 'bingx'] },
            apiKey: { type: String },
            apiSecret: { type: String },
            isActive: { type: Boolean, default: false },
        },

        telegram: {
            chatId: { type: String },
            token: { type: String },
            isActive: { type: Boolean, default: false },
        },

        trade_settings: {
            strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', default: null },
            leverage: { type: Number, default: 10 },
            marginType: { type: String, enum: ['cross', 'isolated'], default: 'isolated' },
            margin: { type: Number, default: 0 },
            tradeLimit: { type: Number, default: 5 },
            isActive: { type: Boolean, default: true },
        },

        trades_history: [{ type: Schema.Types.ObjectId, ref: 'Trade' }],

        notifications: {
            history: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
            isActive: { type: Boolean, default: true },
        },

        settings: {
            timezone: { type: String, default: 'Asia/Tehran' },
            language: { type: String, enum: ['fa', 'en'], default: 'fa' },
        },

        security: {
      
            loginHistory: [
                {
                    ip: { type: String },
                    device: { type: String },
                    date: { type: Date, default: Date.now },
                },
            ],
        },

        subscription: {
            plan: { type: String, enum: ['free', 'pro', 'vip'], default: 'free' },
            expiryDate: { type: Date, default: null },
        },

        isBanned: { type: Boolean, default: false },
        lastLogin: { type: Date },
    },
    { timestamps: true }
);

const userModel =
  mongoose.models.user || mongoose.model<UserInterface>('user', userSchema);

export default userModel;
