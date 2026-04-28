import mongoose from "mongoose"
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enums";
import { IUser } from "../../common/interfaces";
import { generateHash } from "../../common/utils/security/index";
import { HydratedDocument } from "mongoose"
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
    confirmEmail: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },




}, {
    timestamps: true, toObject: { virtuals: true },
    // strictQuery:true
})


userSchema.virtual("userName").set(function (value) {
    let [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;

}).get(function () {
    return `${this.firstName} ${this.lastName}`;

})





//first hook to be called
//validate is the method that is called before saving the document 
//first it will call validate then it will call save
//reject if the first name is less than 3 characters before saving
userSchema.pre("validate", async function () {
    // console.log("pre validate", this);
    if (this.firstName.length < 3) {
        throw new Error("First name must be at least 3 characters long")
    }
})
//second hook to be called
//after validation success
//validate is the method that is called after saving the document
userSchema.post("validate", async function () {

    // console.log("post validate", this);
})

//third hook to be called
//pre save is the method that is called before saving the document
userSchema.pre("save", async function (this: HydratedDocument<IUser> & { wasNew: boolean }) {
    this.wasNew = this.isNew
    //modifiedPaths return array of modified fields
    // console.log(this.modifiedPaths())
    //isModified return true or false
    //we are checking if password is modified or not if it is modified then we are hashing it if not then we are not hashing it
    if (this.isModified("password")) {
        this.password = await generateHash({
            plainText: this.password,

        });
    }
    // console.log("pre saved", this);

})
//fourth hook to be called 
//post save is the method that is called after saving the document 
userSchema.post("save", async function () {
    // console.log("post saved", this);
    // let that:HydratedDocument<IUser> & { wasNew: boolean } = this
    // console.log(that.wasNew);
})
userSchema.pre("updateOne", { document: true }, async function () {
    // console.log("pre updateOne", this);
})

userSchema.pre("findOne",  function () {
    console.log("pre findOne -----");

    // let query = this.getFilter();
    // if (!query.admin) {
    //     this.setQuery({ ...query, isDeleted: false });
// }
})
//work with any find with regular expression
userSchema.pre(/find/, function () {
    // console.log("pre find -----");
})

const userModel = mongoose.model<IUser>("User", userSchema);
export default userModel;