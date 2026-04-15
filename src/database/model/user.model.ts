import mongoose from "mongoose"
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enums";
import { IUser } from "../../common/interfaces";


const userSchema = new mongoose.Schema<IUser>({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profilePic: { type: String },
    profileCoverPic: { type: [String] },
    password: {
        type: String, required: function (this) {
            return this.provider === ProviderEnum.System
        }
    },
    gender: { type: String, default: GenderEnum.Male },
    role: { type: String, default: RoleEnum.User },
    provider: { type: String, default: ProviderEnum.System },
    confirmEmail: { type: Boolean, default: false }




}, { timestamps: true, toObject: { virtuals: true } })


userSchema.virtual("userName").set(function (value) {
    let [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;

}).get(function () {
    return `${this.firstName} ${this.lastName}`;

})

const userModel = mongoose.model<IUser>("User", userSchema);
export default userModel;