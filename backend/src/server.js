import express from "express";
import { ENV } from "./config/env.js";
import {db} from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";


const app =express ()
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.get("/api/health",(req,res)=>{
    res.status(200).json({ success: true });
});

app.get ("/api/favorites/:userId",async(req,res)=>{
    try{
        const { userId } = req.params;
        const userfavorites = await db.select().from(favoritesTable).where(
            eq(favoritesTable.userId,userId))
        res.status(201).json(userfavorites)

    }catch(error){
        res.status(500).json({error:"userID internal server error"}  ); 
    }
})


app.post("/api/favorites", async(req,res)=>{
    try{
        const { userId, recipe_id, title, image, cook_time, servings }  = req.body; 
        if ( !userId || !recipe_id || !title){
            return res.status(400).json({error:"Missing required fields"});
        }
        const newFavorites = await db.insert(favoritesTable).values({
            userId,
            receipeId: recipe_id,
            title,
            image,
            cookTime: cook_time,
            servings     
        }).returning();
        res.status(201).json(newFavorites[0]); 
    }catch(error){
        console.log("Error adding to favorites", error);
        res.status(500).json({error:"internal server error"}  ); 

    }

})

app.delete("/api/favorites/:userId/:recipeId", async(req,res)=>{
    try{
        const { userId, recipeId} = req.params;
        await db.delete(favoritesTable).where(
            and(eq(favoritesTable.userId, userId), eq(favoritesTable.receipeId, parseInt(recipeId)))
        )
        res.status(200).json({message:"Deleted successfully"});
    }catch(error){
        console.log("Error deleting from favorites", error);
        res.status(500).json({error:"internal server error"}  ); 

    }

})

app.listen(PORT,()=>{
 
    console.log("Server is running on port",PORT); 
})    