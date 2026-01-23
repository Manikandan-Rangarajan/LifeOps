import { Router } from "express";
import { protect } from '../../../common/middleware/auth.middleware.js'
import { getRecipes, createRecipe, getRecipeById } from "./recipe.controller.js";

const router = Router()

router.get('/',protect,getRecipes)
router.post('/',protect,createRecipe)
router.get('/:id',getRecipeById)

export default router
