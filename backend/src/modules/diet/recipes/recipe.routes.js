import { Router } from "express";
import { protect } from '../../../common/middleware/auth.middleware.js'
import { getRecipes, createRecipe } from "./recipe.controller.js";

const router = Router()

router.get('/',protect,getRecipes)
router.post('/',protect,createRecipe)

export default router
