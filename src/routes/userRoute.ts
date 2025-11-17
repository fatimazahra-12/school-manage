import { Router } from "express";
import {
  createUser,
    getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  toggleUserActive,
getUsersEtudiantsByGroupe,
  listUsersByRole,
} from "../controllers/userController.js";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById); 
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/toggle", toggleUserActive);
router.get("/groupe/:groupeId/etudiants", getUsersEtudiantsByGroupe);
router.get("/role/:roleName", listUsersByRole);

export default router;
