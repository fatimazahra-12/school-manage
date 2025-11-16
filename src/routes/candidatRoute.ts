import { Router } from "express";
import { getCandidature, getCandidatureStatut, listCandidatures, postCandidature, refuserCandidature, validerCandidature } from "../controllers/candidatController.js";
import { adminOnly } from "../middlewares/candidatMiddleware.js";

const router = Router();
router.post("/", postCandidature);
router.get("/", listCandidatures);
router.get("/:id", getCandidature);
router.patch("/:id/accepter", adminOnly, validerCandidature);
router.patch("/:id/refuser", adminOnly, refuserCandidature);
router.get("/statut", getCandidatureStatut);

export default router;