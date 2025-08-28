import mongoose, { Schema } from 'mongoose';

const TradeEventSchema = new Schema({
    type: { type: String, enum: ['opened', 'tp_hit', 'sl_hit', 'closed'], required: true },
    at: { type: Date, default: Date.now },
    price: { type: Number },
    tpIndex: { type: Number },
    note: { type: String }
}, { _id: false });

const TradeSchema = new Schema({
    tradeId: { type: String, required: true, unique: true }, 
    signalId: { type: String, required: true },
    userId: { type: String, required: true }, 
    exchange: { type: String, required: true },
    symbol: { type: String, required: true }, 
    side: { type: String, enum: ['BUY', 'SELL'], required: true },
    entryPrice: { type: Number, required: true },
    takeProfit: { type: [Number], default: null },
    initialTakeProfit: { type: [Number], default: null },
    stopLoss: { type: Number, default: null },
    status: { type: String, enum: ['open', 'closed', 'cancelled'], default: 'open' },
    exitPrice: { type: Number },
    profitLoss: { type: Number },
    closedPortion: { type: Number, default: 0 },
    tpHitCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    events: { type: [TradeEventSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

TradeSchema.pre('save', function(next) 
{
    this.updatedAt = new Date();
    next();
});


const TradeModel =
  mongoose.models.Trade || mongoose.model('Trade', TradeSchema);

export default TradeModel;