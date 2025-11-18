import { pgTable , serial , integer , text , timestamp } from "drizzle-orm/pg-core" ;
 

export const favoritesTable = pgTable("favorites",{
    id :serial("id").primaryKey(),
    userId : text("user_id").notNull(),
    receipeId : integer("recipe_id").notNull(),
    title: text("title").notNull(),
    image:text("image"),
    cookTime : text("cook_time"),
    servings: text("servings"),
    createdAt: timestamp("created_at").defaultNow() 

})   