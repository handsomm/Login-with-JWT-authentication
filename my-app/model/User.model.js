import mongoose from 'mongoose';

export const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Please provide unique username'],
        unique: [true, 'Username exist'],
    },
    password: {
        type: String,
        require: [true, 'Please provide a password'],
        unique: false,
    },
    email: {
        type: String,
        require: [true, 'Please provide a email'],
        unique: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String },
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);
