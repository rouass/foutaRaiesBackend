const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer_secret_this_should_be_longer_');
    console.log(decodedToken.role);
    req.userData = {
      phone: decodedToken.phone,
      userId: decodedToken.userId,
      role: decodedToken.role // Capture user role from the token
    };

    // Ensure the user is authenticated and is an admin
    if (req.userData.role !== 'admin') {
      throw new Error('Access Denied. Admins only.');
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
