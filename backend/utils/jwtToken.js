export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken(); //generates token for user
    const options = {
      expires: new Date( //token expiry
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 //day
      ), //logs out after expiry
      httpOnly: true, //required for toke generation
    };
  
    res.status(statusCode).cookie("token", token, options).json({ //cookie name is "token", value is token and options
      success: true,
      user,
      message,
      token,
    });
  };