import UserRepository from '../data/repositories/userRepository';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from "../config";
import {Request, Response} from 'express';


class UserController {

    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;

    }

    loginUser = (req: Request, res: Response) => {
        const {email, password} = req.body;
        try {
            this.userRepository.findUserByEmail(email, async (err: Error | null, user: any) => {
                if (err) {
                    return res.status(500).json({message: 'Error finding user'});
                }
                if (!user) {
                    return res.status(401).json({message: 'Invalid email or password'});
                }

                try {
                    if (await bcrypt.compare(password, user.password)) {
                        const accessToken = jwt.sign({userId: user.id}, config.JWT_SECRET, {expiresIn: '1h'});

                        res.json({accessToken});
                    } else {
                        res.status(401).json({message: 'Invalid email or password'});
                    }
                } catch (error) {
                    res.status(500).json({message: 'Error comparing passwords'});
                }
            });
        } catch (error) {
            // Logger..
            throw error;
        }
    };


    addUser = (req: Request, res: Response) => {
        const {email, password} = req.body;
        try {
            this.userRepository.findUserByEmail(email, async (err: Error | null, existingUser: any) => {
                if (err) {
                    return res.status(500).json({message: 'Error finding user'});
                }
                if (existingUser) {
                    return res.status(400).json({message: 'User already exists'});
                }

                const newUser = new User(email, await bcrypt.hash(password, 10));

                await this.userRepository.createUser(newUser, (err: Error | null, user: any) => {
                    if (err) {
                        return res.status(500).json({message: 'Error creating user'});
                    }
                    res.status(201).json({message: 'User created successfully', user});
                });
            });
        } catch (error) {
            // Logger..
            throw error;
        }
    };
}

export {
    UserController
};
