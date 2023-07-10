//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Item from "./items.js";
import listSchema from "./listSchema.js";
import _ from "lodash";
import dotenv from 'dotenv'
dotenv.config();


const app = express();

const PORT=process.env.PORT || 3000;

const Itemz=Item.item;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const MONGO_URI="mongodb+srv://admin-shivam:17042002@cluster0.o1yomxq.mongodb.net/todolistDB";
mongoose.connect(MONGO_URI);

const item1 = new Itemz({
  name: "Welcome to your todo list."
});
 
const item2 = new Itemz({
  name: "Hit + button to create a new item."
});
 
const item3 = new Itemz({
  name: "<-- Hit this to delete an item."
});

const defaultItems=[item1,item2,item3];

const List=listSchema.List;
const items=listSchema.listSchema.items;

// const listSchema={
//   name:String,
//   items:[Item.itemsSchema]
// };

// const List=mongoose.model("list",listSchema);


async function run(){
  try {
    Itemz.insertMany(defaultItems);
    console.log("Item saved");
  } catch (error) {
    console.log(error.message);
  }
}

app.get("/", function(req, res) {
  async function get(){
    try {
      const item_len=await Itemz.find();
      const len=item_len.length;
      if(len===0){
        run();
        res.redirect("/")
      }
      else{
        res.render("list", {listTitle: "Today", newListItems: item_len});
      }

    } catch (error) {
      console.log(error);
    }
  }
  get();
  
});


app.get("/:customListName",(req,res)=>{
  const customListName=_.capitalize(req.params.customListName);

  async function DNDuplicate(){
    try {
        const decision=await List.exists({name:customListName});
        if(decision){
          const foundItems=await List.findOne({name:customListName});
          console.log(foundItems);
          //show existing list
          res.render("list",{listTitle: customListName, newListItems: foundItems.items})
        }
        else{
          //show new list
          console.log("doesnt exist");
          const list=new List({
            name:customListName,
            items:defaultItems
          });
          await list.save();
          res.redirect("/"+customListName);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  DNDuplicate();
})


app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName=req.body.list;
  
  const item4=new Itemz({
    name:item
  })

  if (listName==="Today") {
    async function save(){
      await item4.save();
    }
    save(); 
    res.redirect("/");
  } else {
    async function addElem(){
      const value=await List.findOne({name:listName});
      console.log(value);
      value.items.push(item4);
      value.save();
      res.redirect("/"+listName);
    }
    addElem();
  }

  
});
app.post("/delete",(req,res)=>{
  const id=req.body.checkbox;
  const listName=req.body.listName;
  console.log(listName);

  async function del(){
    if(listName==="Today"){
      await Itemz.deleteOne({_id:id});
      res.redirect("/");
    }
    else{
      await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}});
      // console.log(await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}}))
      res.redirect("/"+listName);
    }
  }

  del()
  
})

app.listen(PORT, function() {
  console.log("Server started on port 3000");
});
