import User from '../modal/userModal.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function auth(req, res) {
    try {
        const token = req.body.token;
        if (!token) return res.status(401).send('Acess denied. No token provided.');

        const decode = jwt.verify(token, process.env.JWT_CODE);

        if (!decode) return res.status(401).send('Acess denied. No token provided.');

        const user = await User.findById(decode.id).select(['-password', "-_id", "-__v"]);
        res.send(user);
    } catch (e) {
        console.log(e);
    }
}

export async function logIn(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (validPassword) {
                const token = jwt.sign({
                    id: user._id,

                }, process.env.JWT_CODE);
                res.send(
                    {
                        token: token
                    });

            } else {
                return res.send({ message: "Log In credentials invalid" });
            }

        } else {
            res.status(400).send({ message: "Log In credential invalid" });
        }
    } catch (e) {
        res.send({ message: e });
    }
}

export async function signUp(req, res) {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            // Email already exists, send an error response
            return res.send({ message: "Email already in use" });
        }
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            photoURL: `https://robohash.org/${req.body.name}${Date.now()}`,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();

        const token = jwt.sign({
            id: user._id,

        }, process.env.JWT_CODE);

        res.send(
            {
                token: token
            });


    } catch (e) {
        console.log(e);
        res.send({ message: "Error on creating User" });
    }
}