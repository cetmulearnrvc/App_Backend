import app from "./app.js"
import dotenv from "dotenv"
import { connectDB } from "./db.js";
import pvr1_router from "./router/pvr1router.js";
import flat_router from "./router/sib_flat_router.js";

dotenv.config();

app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.use('/api/v1',pvr1_router)
app.use('/api/v2',flat_router)

app.listen(3000,()=>
{
    console.log("server started at localhost 3000")
    connectDB()
})
