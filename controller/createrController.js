import Creater from '../modal/createrModal.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export async function logIn(req, res) {
    try {
        let user = await Creater.findOne({ email: req.body.email });
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
            res.send({ message: "Log In credential invalid" });
        }
    } catch (e) {
        res.send({ message: e });
    }
}

export async function signUp (req, res){
    try {
        const existingUser = await Creater.findOne({ email: req.body.email });

        if (existingUser) {
            // Email already exists, send an error response
            return res.send({ message: "Email already in use" });
        }
        let user = new Creater({
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