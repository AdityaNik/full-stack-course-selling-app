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

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
// Put your MongoDB String here
// and provide a database name (create one named as "course_selling_application")
mongoose.connect('mongodb+srv://aadityanikam2004:I3LVVCBiEazcfHd5@cluster0.00dztjl.mongodb.net/', { dbName: "course_selling_application" });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})