import { Router } from "express";
import { Request, Response } from "express";
import * as events from "../controllers/events";
import * as people from "../controllers/people";

const router = Router();

router.get('/ping', (req: Request, res: Response) => res.json({ pong: true }));

router.get('/events/:id', events.getEvent);
router.get('/events/:id_event/search', people.searchPerson);

export default router;