import express from 'express'
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import bookRoute from './routes/book.route.js'

const app = express();

app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/books", bookRoute);

export default app;