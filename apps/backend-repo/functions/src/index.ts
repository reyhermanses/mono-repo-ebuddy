import * as functions from "firebase-functions";
import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: true }));

const BACKEND_URL = "http://localhost:8001/api/v1"; // Ganti sesuai kebutuhan

app.all("*", async (req: Request, res: Response) => {
    const url = `${BACKEND_URL}${req.path}`;
    try {
        const response = await fetch(url, {
            method: req.method,
            headers: {
                ...req.headers,
                host: new URL(BACKEND_URL).host, // Hindari error CORS
            },
            body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.text();
        res.status(response.status).send(data);
    } catch (error) {
        res.status(500).send({ error: "Proxy request failed", details: error });
    }
});

export const api = functions.https.onRequest(app);