import mongoose, {Document, Model, Schema} from "mongoose";

export interface IAlert extends Document {
    userId: mongoose.Types.ObjectId;
    symbol: string;
    companyName: string;
    condition: 'above' | 'below';
    targetPrice: number;
    frequency: 'once' | 'per_minute' | 'per_hour' | 'per_day';
    isActive: boolean;
    isTriggered: boolean;
    lastTriggeredAt: Date | null;
    createdAt: Date;
}

const AlertSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        enum: ['above', 'below'],
        required: true
    },
    targetPrice: {
        type: Number,
        required: true
    },
    frequency: {
        type: String,
        enum: ['once', 'per_minute', 'per_hour', 'per_day'],
        default: 'once'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isTriggered: {
        type: Boolean,
        default: false
    },
    lastTriggeredAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Alert: Model<IAlert> = mongoose.models?.Alert || mongoose.model<IAlert>("Alert", AlertSchema);

export default Alert;
