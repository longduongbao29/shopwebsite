import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const url = typeof req.query.url === "string" ? req.query.url : null;
        if (!url) {
            res.status(400).json({ error: "Invalid or missing 'url' query parameter" });
            return;
        }

        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
        res.send(Buffer.from(buffer));
    } catch (error) {
        res.status(500).json({ "error": error});
    }
}
