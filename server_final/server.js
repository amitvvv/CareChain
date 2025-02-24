const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { createConnection } = require("./api/mongodb");

// ייבוא נתיבי routes
const authRoutes = require("./routes/authRoutes");
const contractRoutes = require("./routes/contractRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const supportRoutes = require("./routes/supportRoutes");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
const PORT = 443;

// קריאת תעודות ה-SSL
const options = {
    key: fs.readFileSync("./certs/server.key"),
    cert: fs.readFileSync("./certs/server.crt"),
    ca: fs.readFileSync("./certs/rootCA.crt"), // מוסיף את ה-CA
    crl: fs.readFileSync("./certs/crl.pem") // ✅ טוען את ה-CRL מהתיקייה הנכונה
};

// יצירת חיבור ל-MongoDB
createConnection()
    .then(() => console.log("✅ MongoDB Connected OK"))
    .catch((e) => console.error(`❌ MongoDB Connection ERROR - ${e}`));

// הגדרת מידלוור (middleware)


app.use(cors({
    origin: "https://localhost:3000", // ודא שזה HTTPS!
    credentials: true, // חובה לשליחת Cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));




app.use(cookieParser());
app.use(mongoSanitize());

// 🚀 Middleware 1: **מונע קריסת השרת אם מגיע JSON לא חוקי**
app.use(express.json({ limit: "10kb" }));
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON format" });
    }
    next();
});

// הגדרת הנתיבים
app.use("/", authRoutes);
app.use("/contracts", contractRoutes);
app.use("/users", userRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/support-requests", supportRoutes);

// יצירת שרת HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`🚀 Secure Server is running on https://localhost:${PORT}`);
});
