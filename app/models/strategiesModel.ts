import mongoose , { Document, Schema } from 'mongoose';

export interface IStrategy extends Document {
  name: string;
  strategy_id: string;
  createdAt: Date;
  updatedAt: Date;
}

const strategySchema = new Schema<IStrategy>({
    name: { type: String, required: true, unique: true },
    strategy_id: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const StrategyModel = mongoose.models.Strategy || mongoose.model<IStrategy>('Strategy', strategySchema);
export default StrategyModel;