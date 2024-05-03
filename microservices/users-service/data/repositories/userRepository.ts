import UserDB, {UserDocument} from "../entity/userDb";
import db from "./local_datasource/db";

class UserRepository {
    constructor() {
        // Assuming db() returns a Promise
        db().then(() => {
            console.log("Connected to the database");
        }).catch((error) => {
            console.error("Error connecting to the database:", error);
        });
    }

    async createUser(user: any, callback: (error: Error | null, user: UserDocument | null) => void) {
        try {
            const newUser = await UserDB.create(user);
            callback(null, newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            callback(error, null);
        }
    }

    async findUserByEmail(email: string, callback: (error: Error | null, user: UserDocument | null) => void) {
        try {
            const user = await this.findUserByEmailInner(email);
            if (user) {
                callback(null, user);
            } else {
                callback(null, null);
            }
        } catch (error) {
            console.error('Error finding user:', error);
            callback(error, null);
        }
    }

    private async findUserByEmailInner(email: string): Promise<UserDocument | null> {
        try {
            return await UserDB.findOne({ email: email });
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }
}

export default UserRepository;
