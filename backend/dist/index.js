"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const admin_js_1 = __importDefault(require("./routes/admin.js"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const port = 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/admin', admin_js_1.default);
app.use('/users', user_js_1.default);
app.get('/', (req, res) => {
    res.json({
        "msg": "Hello from backend"
    });
});
// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
// Put your MongoDB String here
// and provide a database name (create one named as "course_selling_application")
mongoose_1.default.connect('mongodb+srv://adityanikam481:YQb7ocD461hqbMUt@cluster0.6clgv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { dbName: "course_selling_application" });
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
