import express from "express"
import cors from "cors"

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());


app.use("/register", (req, res) => {
    res.status(201).json({
        message: "Register route works"
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});