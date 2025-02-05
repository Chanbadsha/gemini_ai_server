require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(express.json());
app.use(cors());

// Get Test Api
app.get("/test-ai", async (req, res) => {
  const prompt = req.query?.text;
  if (!prompt) {
    return res.send({ message: "Please provide a prompt" });
  }
  const result = await model.generateContent(prompt);

  res.send(result.response.text());
});

// Json Data Generate
app.get("/generate-json", async (req, res) => {
  const prompt = req.query?.prompt;
  if (!prompt) {
    return res.send({ message: "Please provide a prompt" });
  }

  const FinalPrompt = ` generate json data of this ${prompt}  using this JSON schema:

Output = {'property': value}
Return: Array<Output>`;

  const result = await model.generateContent(FinalPrompt);
  const Output = result.response.text().slice(7, -4);
  const JsonData = JSON.parse(Output);
  res.send(JsonData);
});

// Basic Code
app.get("/", async (req, res) => {
  res.status(200).send({ message: "The server is running successfully!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
