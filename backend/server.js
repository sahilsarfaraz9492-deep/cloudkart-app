const express = require("express");
const app = express();
app.use((req, res, next) => {
	  res.header("Access-Control-Allow-Origin", "*");
	  next();
});
app.get("/", (req, res) => res.send("CloudKart Backend v2"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(3000, () => console.log("Listening on 3000"));
