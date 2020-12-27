import { check, query } from 'express-validator';
import { isValid } from 'shortid';

// Validators

const isShortId = (value: string) => isValid(value);

export const shortIdValidation = (key: string) => check(key).custom(isShortId);

export const searchValidation = query('q').exists();

export const userFieldsValidator = [
    check('name').exists(),
    check('password').exists(),
    check('username').exists(),
];

export const isUserValidator = [
    check('name').optional({ checkFalsy: true }).isString().trim(),
    check('username').optional({ checkFalsy: true }).isString().trim(),
    check('password').optional({ checkFalsy: true }).isString().trim(),
];

export const isValidEntityValidator = [check('entity').isIn(['users']).trim()];
