import Recipe from './recipe.model.js'
import mongoose from 'mongoose'

export const createRecipe = async(req,res)=>{
  try{
    const userId = req.user.userId
    const { title, ingredients, steps, macros } = req.body
    if(!title || !ingredients || !steps){
      return res.status(400).json({message:"Misssing required fields"})
    }
    
    const cleanIngredients = ingredients.filter(i => i.trim());
    const cleanSteps = steps.filter(s => s.trim());

    if (cleanIngredients.length === 0 || cleanSteps.length === 0) {
        return res.status(400).json({ message: "Ingredients and steps cannot be empty" });
    }

    const recipe = await Recipe.create(
      {
        userId,
        title,
        ingredients,
        steps,
        macros
      }
    )
    res.status(201).json({
      message:"Recipe created",
      recipe
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:"Internal server error"})
  }
}

export const getRecipes = async(req,res)=>{
  try{
    const page = Math.max(parseInt(req.query.page)||1,1)
    const limit = Math.min(parseInt(req.query.limit)||20,50)
    const skip = (page-1)*limit

    const [recipes,total] = await Promise.all([
      Recipe.find().sort({createdAt:-1}).skip(skip).limit(limit),
      Recipe.countDocuments()
    ])

    res.status(200).json({
      page,
      limit,
      total,
      totalPages:Math.ceil(total/limit),
      count: recipes.length,
      recipes
    })
  }catch(err){
    console.error(err)
    return res.status(500).json({message:'Internal server error'})
  }
}

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
