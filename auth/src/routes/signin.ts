import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@yovelsapir_sgtickets/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
   '/api/users/signin',
   [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
         .trim()
         .notEmpty()
         .withMessage('You muse supply a password'),
   ],
   validateRequest,
   async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const exitingUser = await User.findOne({ email });

      if (!exitingUser) {
         throw new BadRequestError('Invalid credentials.');
      }

      const passwordMatch = await Password.compare(
         exitingUser.password,
         password
      );

      if (!passwordMatch) {
         throw new BadRequestError('Invalid credentials.');
      }

      // Generate JWT
      const userJwt = jwt.sign(
         {
            id: exitingUser.id,
            email: exitingUser.email,
         },
         process.env.JWT_KEY!
      );

      // Store it on session object
      req.session!.jwt = userJwt;

      console.log(req.session);

      res.status(200).send(exitingUser);
   }
);

export { router as signinRouter };
