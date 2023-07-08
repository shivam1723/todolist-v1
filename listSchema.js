import mongoose from "mongoose";
import Item from "./items.js";


const listSchema={
    name:String,
    items:[Item.itemsSchema]
  };
  
const List=mongoose.model("list",listSchema);

export default {List,listSchema};