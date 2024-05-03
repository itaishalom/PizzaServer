import mongoose, {Document, Schema, Model} from 'mongoose';

interface User {
    email: string;
    password: string;
}

const UserSchema = new Schema<User>({
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
});

interface UserModel extends Model<UserDocument> {
}

export interface UserDocument extends User, Document {
}

const UserDB: UserModel = mongoose.model<UserDocument>('UserDB', UserSchema);

export default UserDB;
