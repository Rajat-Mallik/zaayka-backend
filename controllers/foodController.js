import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from 'fs';


// add food item
const addFood = async (req, res) => {
  try {
    const file = req.file;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "zaayka_food" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: "Upload failed" });
        }

        const imageUrl = result.secure_url;

        // Save to DB
        const food = new foodModel({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          image: imageUrl,
        });

        await food.save();

        res.json({ success: true, message: "Food Added" });
      }
    );

    // Pipe buffer to cloudinary
    const stream = result;
    stream.end(file.buffer);

  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error in adding food"})
  }
}

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({success: true, data: foods});
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"});
  }
}

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, ()=>{})
    
    await foodModel.findByIdAndDelete(req.body.id)
    res.json({success: true, message:"Food Removed"});
  } catch (error) {
    console.log(error);
    res.json({success:false, message: "Error in Removing"})
  }
}

export { addFood, listFood , removeFood};