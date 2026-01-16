import mongoose, {Document, Model, Schema} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    watchlistPreferences: {
        emailFrequency: 'daily' | 'weekly' | 'never';
        emailTime: string;
        includeAiSummary: boolean;
    };
}

const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    emailVerified: {type: Boolean},
    image: {type: String},
    watchlistPreferences: {
        emailFrequency: {
            type: String,
            enum: ['daily', 'weekly', 'never'],
            default: 'daily'
        },
        emailTime: {
            type: String,
            default: '08:00'
        },
        includeAiSummary: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true,
    collection: 'user'
});

const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default User;
