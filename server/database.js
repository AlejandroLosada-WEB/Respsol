const mongoose = require("mongoose");
const basededatos = "mongodb://localhost/instaClone";
//const basededatos = "mongodb+srv://alosamart:Losalosa7@instaclone.30i5o.mongodb.net/instaclone";

mongoose.connect(basededatos)
.then(db=>console.log("Base de datos conectada"))
.catch(err=>console.error("Error "+err));

module.exports = mongoose;