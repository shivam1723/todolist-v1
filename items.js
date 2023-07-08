import mongoose from "mongoose";

const itemsSchema=new mongoose.Schema({
    name:String
})
const item=mongoose.model("item",itemsSchema);

export default {item,itemsSchema};