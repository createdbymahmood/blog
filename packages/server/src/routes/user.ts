import express, { Request, Response } from 'express';
import { createUser } from '../controllers/user';
import { validateMiddleware } from '../middlewares/validate';
import { User } from '../models/user';
import { isUserValidator, userFieldsValidator } from '../validators';

const router = express.Router();

const REGISTER = '/register';
const HEALTH = '/health';

router.get(HEALTH, (req, res) => {
    /* istanbul ignore next */
    res.status(200).json({ health: 'Ok' });
});

router.post(
    REGISTER,
    userFieldsValidator,
    validateMiddleware(isUserValidator),
    (req: Request, res: Response) => {
        const userDetails: User = req.body;

        const user = createUser(userDetails);

        res.status(201);
        res.json({ user: user });
    }
);

export default router;
