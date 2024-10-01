import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";

const port = 3000
const app = express()

app.use(cors());
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
    res.json({
        "msg": "Hello from backend"
    })
})

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
// Put your MongoDB String here
// and provide a database name (create one named as "course_selling_application")
mongoose.connect('', { dbName: "" });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
