import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './bd.ts';

dotenv.config({path: "./.env", override: true})

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());


async function server() {
  try {
    app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту `))
  } catch(e) {
    console.log(e);
  }
}

server();