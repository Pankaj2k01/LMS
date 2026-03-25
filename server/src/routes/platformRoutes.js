import { Router } from "express";
import {
  dashboardController,
  healthController,
  listStatic,
  platformDataController,
  staticCollections
} from "../controllers/platformController.js";
import { authMiddleware, requireRoles } from "../middleware/auth.js";
import { withAsync } from "../utils/validation.js";

export function createPlatformRoutes(getDbStatus) {
  const router = Router();

  router.get("/health", healthController(getDbStatus));
  router.get("/dashboard", authMiddleware, dashboardController);
  router.get("/platform-data", authMiddleware, withAsync(platformDataController));
  router.get("/attendance", authMiddleware, requireRoles("super_admin", "school_admin", "vice_principal", "teacher"), listStatic(staticCollections.attendance));
  router.get("/roles", authMiddleware, requireRoles("super_admin", "school_admin", "vice_principal", "teacher"), listStatic(staticCollections.roles));
  router.get("/settings/integrations", authMiddleware, requireRoles("super_admin", "school_admin", "vice_principal"), listStatic(staticCollections.integrations));

  return router;
}
