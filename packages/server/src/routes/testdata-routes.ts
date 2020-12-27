import express from 'express';
import { DbSchema } from '../models/dbSchema';
import { getAllForEntity, seedDatabase } from '../loaders/database';
import { isValidEntityValidator } from '../validators';
import { validateMiddleware } from '../middlewares/validate';
const router = express.Router();

// Routes

//POST /testData/seed
router.post('/seed', (req, res) => {
    seedDatabase();
    res.sendStatus(200);
});

//GET /testData/:entity
router.get(
    '/:entity',
    validateMiddleware([...isValidEntityValidator]),
    (req, res) => {
        const { entity } = req.params;
        const results = getAllForEntity(entity as keyof DbSchema);

        res.status(200);
        res.json({ results });
    }
);

export default router;
