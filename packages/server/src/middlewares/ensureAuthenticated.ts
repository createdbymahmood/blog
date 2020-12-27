import { NextFunction, Request, Response } from 'express';

export const ensureAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.isAuthenticated()) {
        return next();
    }
    /* istanbul ignore next */
    res.status(401).send({
        error: 'Unauthorized',
    });
};
