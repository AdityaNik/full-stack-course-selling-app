const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require("./routes/admin.js");
const userRouter = require("./routes/user.js");

const port = 3000
const app = express()

app.use(cors());
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/users', userRouter);

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('mongodb+srv://aadityanikam2004:I3LVVCBiEazcfHd5@cluster0.00dztjl.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "course_selling_application" });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})