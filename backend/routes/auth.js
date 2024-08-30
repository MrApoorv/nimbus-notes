const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const fetchuser = require('../middleware/fetchuser')
const jwt = require('jsonwebtoken');
JWT_SECRET = 'OnePieceisReal!';

//ROUTE 1:CREATE USER
//create a user using POST /api/auth/createuser . NO authentication needed NO login req
router.post('/createuser',
    [
        body('name', 'Enter Name with atleast 3 characters').isLength({ min: 3 }),
        body('email', 'Enter valid Email').isEmail(),
        body('password', 'Enter password with atleast 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {
        let success=false;
        //if there are errors , return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success,errors: errors.array() });
        }
        //check email exist already
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success,error: "Email with user already exists" })
            }
            //Genrating salt and hashing the password alogn with it to store securely in database using bcrypt
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })

            //retrieving the user id from database in obj data
            const data = {
                user: {
                    id: user.id,
                }
            }
            //signing the id with a token using jwt 
            const authToken = jwt.sign(data, JWT_SECRET);
            success=true;
            res.json({ success,authToken });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

//ROUTE 2 : LOGIN
//Authenticate user using entered email and password NO login req
router.post('/login',
    [
        body('email', 'Enter valid Email').isEmail(),
        body('password', 'Password cannot be blank').exists(),
    ],
    async (req, res) => {
        //if there are errors , return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            let success=false;
            if (!user) {
                return res.status(400).json({ success, error: "Invalid Credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Invalid Credentials" });
            }

            const data = {
                user: {
                    id: user.id,
                }
            }
            //signing the id with a token using jwt 
            const authToken = jwt.sign(data, JWT_SECRET);
            success=true;
            res.json({ success, authToken });

        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    })

//ROUTE 3: Get user details Login Required
router.post('/getuser', fetchuser,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    })

module.exports = router;