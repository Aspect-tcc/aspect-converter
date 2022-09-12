//pacotes necessarios
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

//criando o servidor expresso
const app = express();

//numero PORT do servidor
const PORT = process.env.PORT || 3000;

//engine template
app.set("view engine", "ejs");
app.use(express.static("public"));

//POST request para o html
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res) => {
    const videoID = req.body.videoID;
    console.log(videoID);
    if(
        videoID === undefined ||
        videoID === "" ||
        videoID === null
    ){
        return res.render("index", {success : false, message : "Por favor, informe a ID do video"});
    }else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
            "method" : "GET",
            "headers": {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        if(fetchResponse.status === "ok")
            return res.render("index", {success : true, song_title: fetchResponse.title, song_link : fetchResponse.link});
        else
            return res.render("index", {success : false, message : fetchResponse.msg})
    }
})

//iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em port ${PORT}`);
})