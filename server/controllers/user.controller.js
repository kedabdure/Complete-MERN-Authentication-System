import userModel from "../models/user.model.js";

export const getUserDate = async (req, res) => {
  try {

    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true, userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}


export const getUsersData = async (req, res) => {
  try {
    const users = await userModel.find();

    if (!users) {
      return res.json({ success: false, message: "User not found" })
    }

    res.json({
      success: true, usersDate: users
    })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}