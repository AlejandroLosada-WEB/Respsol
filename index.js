const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const router = express.Router();
const path = require("path");
const helmet = require("helmet");
const fs = require('fs');

 



//midelwares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());



app.use(helmet());

//CERTIFICADOS//

const http = require('http');
//const https = require('https');
//const privateKey = fs.readFileSync('/etc/letsencrypt/live/elbarqr.com/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/elbarqr.com/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/elbarqr.com/chain.pem', 'utf8');

//const credentials = {
//    key: privateKey,
//    cert: certificate,
//    ca: ca,
//    requestCert: true,
//    rejectUnauthorized: false
//};

const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);
//CERTIFICADOS//

const { mongoose } = require("./server/database");
const user = require("./server/routes/user.routes");
const photos = require("./server/routes/photos.routes");
const photos_comments = require("./server/routes/photos_comments.routes");

//const elbar = require("./server/routes/elbar.routes");
//settings
//app.set("port",process.env.PORT || 3003);

//routes
app.use("/v1/users",user);
app.use("/v1/photos",photos);
app.use("/v1/comments",photos_comments);

//app.use(express.static(path.join('./server/dist/client')));
app.use(express.static('./server/dist/frontend',{redirect:false}));


app.get('*',function(req,res,next){
      res.sendFile(path.resolve('./server/dist/frontend/index.html'));
});

  //app.use("/elbar",elbar);


//CERTIFICADOS
//const server2=httpServer.listen(3000);

const server=httpServer.listen(3000,()=>{
    console.log("Escuchando en el puerto "+3000);
    //console.log("HTTPS");
});

/*app.get('/', function(req, res){
    res.send('hola');
});
*/
/*app.get('/elbar/', function(req, res){
    res.sendFile('index.html', { root: path.join('./server/client') });
});*/

/*const server=httpServer.listen(3000,()=>{
   //console.log("Escuchando en el puerto "+3000);
});*/

