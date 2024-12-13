import express from 'express';
import productRouter from './routes/products.mjs';
import frontRouter from './routes/frontEnd.mjs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

mongoose.connect('mongodb://localhost:27017/crud')
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(`Error:${err}`));

app.use(express.json());

app.use('/', express.static(path.join(__dirname, '/public')))

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
};
app.use(loggingMiddleware);

app.use(frontRouter);
app.use(productRouter);

const PORT = process.env.PORT || 3200;

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
