import mongoose, { Schema } from 'mongoose';

const SignalEventSchema = new Schema({
    type: { type: String, enum: ['signal_created', 'tp_hit', 'sl_hit', 'closed'], required: true },
    at: { type: Date, default: Date.now },
    price: { type: Number },
    tpIndex: { type: Number },
    note: { type: String }
}, { _id: false });

const SignalSchema = new Schema({
    signalId: { type: String, required: true, unique: true },
    strategyId: { type: String, required: true },
    exchange: { type: String, required: true },
    symbol: { type: String, required: true },
    timeframe: { type: String, required: true },
    signal: { type: String, enum: ['buy', 'sell', 'hold'], required: true },
    takeProfit: { type: [Number], default: null }, 
    initialTakeProfit: { type: [Number], default: null },
    stopLoss: { type: Number, default: null },
    confidence: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'triggered', 'closed'], default: 'pending' },
    closedPortion: { type: Number, default: 0 },
    tpHitCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    events: { type: [SignalEventSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

SignalSchema.index({ exchange: 1, symbol: 1, timeframe: 1, strategyId: 1, status: 1 });
SignalSchema.index({ status: 1, createdAt: 1 });
SignalSchema.index({ strategyId: 1, createdAt: 1 });
SignalSchema.index({ exchange: 1, symbol: 1, createdAt: 1 });

SignalSchema.pre('save', function(next) 
{
    this.updatedAt = new Date();
    next();
});

export default
  mongoose.models.Signal || mongoose.model('Signal', SignalSchema);