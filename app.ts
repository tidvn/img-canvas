import express from "express";
import { createCanvas, loadImage } from "canvas";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to generate image and return it as a media file
app.get("/", async (req, res) => {
    try {
        const { name, email, wallet } = req.query;
        if (!name || !email || !wallet) {
            throw new Error("Missing required fields");
        }
        const walletStr = String(wallet);
        const walletFormatted =
            walletStr.length > 30
                ? `${walletStr.slice(0, 15)}...${walletStr.slice(-12)}`
                : walletStr;

        const width = 1000;
        const height = 500;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Load and set background image
        const backgroundImage = await loadImage("./luma-hn.png");
        ctx.drawImage(backgroundImage, 0, 0, width, height);

        // Set font and write text
        ctx.font = "bold 20px 'Open Sans'";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(String(name), 533, 242);
        ctx.fillText(String(email), 533, 294);
        ctx.fillText(String(walletFormatted), 533, 347);

        // Convert canvas to buffer
        const buffer = canvas.toBuffer("image/png");

        // Set the content type to image/png and send the buffer
        res.setHeader("Content-Type", "image/png");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=generated-image.png"
        );
        res.send(buffer);
    } catch (error: any) {
        console.error("Error:", error);
        res
            .status(500)
            .json({ message: "An error occurred", error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
