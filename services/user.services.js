class UserServives {
    createUser = async (data) => {
        try{
            const user = await data.save();
            return user;
        } catch {
            console.log("Registration Failed");
            return "Registration Failed";
        }
    }
}

module.exports = UserServives;