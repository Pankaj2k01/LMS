import { Router } from "express";
import { createCrudController } from "../controllers/crudControllerFactory.js";
import { authMiddleware, requireRoles } from "../middleware/auth.js";
import { validateRequiredFields, withAsync } from "../utils/validation.js";

export function createCrudRouter({
  repository,
  roles,
  listRoles,
  createRoles,
  updateRoles,
  deleteRoles,
  requiredFields,
  buildRecord,
  buildUpdates
}) {
  const router = Router();
  const controller = createCrudController({ repository, buildRecord, buildUpdates });
  const readAccess = listRoles || roles;
  const createAccess = createRoles || roles;
  const updateAccess = updateRoles || roles;
  const deleteAccess = deleteRoles || roles;

  router.get("/", authMiddleware, requireRoles(...readAccess), withAsync(controller.list));
  router.post("/", authMiddleware, requireRoles(...createAccess), validateRequiredFields(requiredFields), withAsync(controller.create));
  router.put("/:id", authMiddleware, requireRoles(...updateAccess), validateRequiredFields(requiredFields), withAsync(controller.update));
  router.delete("/:id", authMiddleware, requireRoles(...deleteAccess), withAsync(controller.remove));

  return router;
}
