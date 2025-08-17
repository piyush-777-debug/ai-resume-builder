const express = require('express');
const connectDb = require('./config/db');
const app = express();
const http = require('http').createServer(app);
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser')


dotenv.config();

//routes import 
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const resumeRoutes = require('./routes/resumeRoutes');


connectDb();



const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//routes
app.use('/api/auth',authRoutes);
app.use('/api/resume',resumeRoutes);
app.use('/api/ai',aiRoutes);


app.get('/', (req, res) => {
    res.send('API is Running...');
})

app.use((req,res)=>{
  res.status(404).send("404 NOT FOUND");
})

app.listen(PORT,()=>{
    console.log("successfully connected to port 3000");
})



