const express = require("express");
const { createCanvas, loadImage } = require("canvas");

const app = express();
const PORT = 3000;

// Middleware to parse JON bodies
app.use(express.json());
app.get("/ticket", async (req, res) => {
  try {
    const { name, email, wallet, avatar } = req.query;
    if (!name || !email || !wallet || !avatar) {
      throw new Error("Missing required fields");
    }
    let avatarImg = "./avatar_default.png";
    if (
      String(avatar).startsWith("http://") ||
      String(avatar).startsWith("https://")
    ) {
      avatarImg = avatar;
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
    const backgroundImage = await loadImage("./background.png");
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    // Set font and write text
    ctx.font = "bold 20px 'Open Sans'";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(String(name), 533, 242);
    ctx.fillText(String(email), 533, 308);
    ctx.fillText(String(walletFormatted), 533, 372);

    const avatarImage = await loadImage(avatarImg);
    const avatarSize = 100;
    const avatarX = 30;
    const avatarY = 370;
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2 + 3,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png");

    // Set the content type to image/png and send the buffer
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=generated-image.png"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});
app.get("/certificate", async (req, res) => {
  try {
    const { type, name, avatar } = req.query;
    if (!type || !name || !avatar) {
      throw new Error("Missing required fields");
    }
    let avatarImg = "./avatar_default.png";
    if (
      String(avatar).startsWith("http://") ||
      String(avatar).startsWith("https://")
    ) {
      avatarImg = avatar;
    }
    const width = 862;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const backgroundImage =
      type == "3"
        ? await loadImage("./cert3.jpg")
        : type == "2"
        ? await loadImage("./cert2.jpg")
        : await loadImage("./cert1.jpg");

    ctx.drawImage(backgroundImage, 0, 0, width, height);

    function drawCenteredText(ctx, text, y) {
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const textWidth = ctx.measureText(text).width;
      const x = (width - textWidth) / 2;
      ctx.fillText(text, x, y);
    }

    // ctx.font = "bold 20px Genta";
    // drawCenteredText(ctx, "Certificate", 370);

    //thêm ảnh vào đây
    const avatarImage = await loadImage(avatarImg);
    const avatarSize = 300;
    const avatarX = (width - avatarSize) / 2;
    const avatarY = 350;
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
    ctx.lineWidth = 20;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(
      avatarX + avatarSize / 2,
      avatarY + avatarSize / 2,
      avatarSize / 2 + 3,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    ctx.font = "bold 60px Genta";
    drawCenteredText(ctx, name, 700);

    ctx.font = "bold 20px Genta";
    drawCenteredText(ctx, "Participated The Event", 800);
    const buffer = canvas.toBuffer("image/png");
    res.setHeader("Content-Type", "image/png");
    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=generated-image.png"
    // );
    res.send(buffer);
  } catch (error) {
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
