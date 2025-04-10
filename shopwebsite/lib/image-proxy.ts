// /pages/api/image-proxy.ts
export default async function handler(req, res) {
    const url = req.query.url;

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.send(Buffer.from(buffer));
}
