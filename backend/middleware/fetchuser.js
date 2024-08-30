const jwt = require('jsonwebtoken');
JWT_SECRET = 'OnePieceisReal!';

const fetchuser = (req, res, next) => {
    //Get user from JWT token and add id to req object
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next(); // calls next fn i.e the async fn in router
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })

    }

}


module.exports = fetchuser;