import jwt from 'jsonwebtoken';


const userAuth = async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login again" })
  }

  try {
    // decode the token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
    if (tokenDecode.id) {
      const { id } = tokenDecode

      req.body.userId = id
    } else {
      return res.json({ success: false, message: "Not Authorized. Login Again" })
    }

    // execute the sendOtp controller
    next();
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export default userAuth;
