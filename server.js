import 'dotenv/config.js'
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';



// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      origin.includes("vercel.app") ||
      origin === "http://localhost:5173"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

// api endpoints
app.get("/", (req, res)=>{
    res.send("API Working")
})

// listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
