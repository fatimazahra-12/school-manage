import { Router } from 'express';
import { listSalles, getSalleById, createSalle, updateSalle, deleteSalle } from "../controllers/salleController.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";

const r = Router();

r.get('/', checkPermission("SALLE_VIEW"), listSalles);
r.get('/:id', checkPermission("SALLE_VIEW"), getSalleById);
r.post('/', checkPermission("SALLE_MANAGE"), createSalle);
r.put('/:id', checkPermission("SALLE_MANAGE"), updateSalle);
r.delete('/:id', checkPermission("SALLE_MANAGE"), deleteSalle);

export default r;
