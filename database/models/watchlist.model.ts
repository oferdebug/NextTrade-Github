import mongoose, {Document, Model, Schema} from "mongoose";

export interface WatchlistItem extends Document {
    userId: mongoose.Types.ObjectId;
    symbol: string;
    companyName: string;
    notes?: string;
    addedAt: Date;
}

const WatchlistSchema: Schema = new Schema({
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
        required: true,
        trim: true
    },
    notes: {
        type: String,
        default: ''
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// Add a compound index on userId + symbol so a user can't add the same stock twice.
WatchlistSchema.index({userId: 1, symbol: 1}, {unique: true});

const Watchlist: Model<WatchlistItem> = mongoose.models?.Watchlist || mongoose.model<WatchlistItem>("Watchlist", WatchlistSchema);

export default Watchlist;
