const express = require("express");
const { resolve } = require("path");
const connectDB = require("./db.js");
const userModel = require("./user.model.js");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const app = express();
const port = 3010;
dotenv.config();

app.use(express.static("static"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.post("/login", async (req, res) => {
  try {
    const { mail, password } = req.body;
    if (!mail || !password) {
      return res
        .status(400)
        .send({ message: "all fields are required", success: false });
    }
    const userExists = await userModel.findOne({ mail: mail });
    if (!userExists) {
      return res.status(400).send({
        message: "User does not exist, please sign up",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ message: "incorrect password", success: false });
    }
    return res.status(200).send({ message: "login successful", success: true });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ message: "Internal Server Error", success: false });
  }
});
app.post("/register", async (req, res) => {
  try {
    const { username, mail, password } = req.body;

    // Fixing the condition to check for missing fields
    if (!username || !mail || !password) {
      return res.status(400).send({ message: "Enter username, mail, and password", success: false });
    }

    const userExists = await userModel.findOne({ mail: mail });

    // Fixing the typo in the variable name
    if (userExists) {
      return res.status(400).send({ message: "User already exists", success: false });
    }

    // Hashing the password and creating the user
    bcrypt.hash(password, 10, async function (err, hashed) {
      if (err) {
        return res.status(400).send({ message: "Error in hashing password", success: false });
      }

      console.log("Password hashed");
      const user = await userModel.create({
        username,
        mail,
        password: hashed,
      });

      return res.status(200).send({ message: "User created", success: true });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Internal server error", success: false });
  }
});


app.listen(port, () => {
  connectDB();
  console.log(`Example app listening at http://localhost:${port}`);
});
