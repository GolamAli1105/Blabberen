import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
    try{
        const { query } = req.query;
        const users = await User.find({
            fullName: { $regex: query, $options: "i" },
            _id: { $ne: req.user._id }, 
        }).limit(10);
        res.status(200).json(users);
    }
    catch(error){
        console.log("Error in searchUsers controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const deleteContact = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const contactId = req.params.id;

        const user = await User.findById(loggedInUserId);

        user.contacts = user.contacts.filter(
            (id) => id.toString() !== contactId
        );

        await user.save();

        res.status(200).json({ message: "Contact removed", contactId });
    } 
    catch (error) {
        console.error("Error in deleteContact controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
