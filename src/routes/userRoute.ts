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
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, checkPermission("USER_VIEW"), getAllUsers);

router.get("/:id", authMiddleware, checkPermission("USER_view"), getUserById); 
router.post("/", authMiddleware, checkPermission("USER_MANAGE"), createUser);
router.put("/:id", authMiddleware, checkPermission("USER_MANAGE"), updateUser);
router.delete("/:id", authMiddleware, checkPermission("USER_MANAGE"), deleteUser);
router.patch("/:id/toggle", authMiddleware, toggleUserActive);
router.get("/groupe/:groupeId/etudiants", authMiddleware, getUsersEtudiantsByGroupe);
router.get("/role/:roleName", authMiddleware, checkPermission("USER_VIEW"), listUsersByRole);

export default router;
