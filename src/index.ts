// process.on("uncaughtException", (err) => {
//     console.error("Uncaught Exception:", err);
//   });
  
//   process.on("unhandledRejection", (reason) => {
//     console.error("Unhandled Rejection:", reason);
//   });

import express from 'express';
import roleRoutes from "../src/routes/roleRoute.js";
import permissionRoutes from "../src/routes/permissionRoute.js";
import rolePermissionRoutes from "../src/routes/rolepermissionRoute.js";


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8081;

app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});