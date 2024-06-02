import { Router } from "express";
import { Manager_users } from "../controllers/controller-users.js";
import { uploadFile } from "../utils/multerFile.js";
import { authStatus } from "../middlewares/authDocumets.js";

export const router = Router()


router.post("/premium/:uid",authStatus(),Manager_users.changePremium)
router.post("/:id/documents",uploadFile.single("document"), Manager_users.uploadsFile)