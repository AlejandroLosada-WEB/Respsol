const User = require('../models/user.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const JWT_Secret = 'InStAcLoNe';
const nodemailer = require('nodemailer');
const ruta = 'http://localhost:4200';
//const ruta = 'http://localhost:3000';
const passwordHash = require('password-hash');
const formidable2 = require('formidable');
const imagemin = require("imagemin");
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg  = require('imagemin-mozjpeg');
const resizeImg = require('resize-img');
const fs = require('fs');
userCTRL = {};
const UserToken=new User();

//CONTROLIP

userCTRL.controlIP = async (req, res, next) => {
    let ip = req.ip.split(':');
    /*console.log(ip[3]);*/
    if (req.ip == '::1' || ip[3] == '138.68.153.191' || ip[3] == '127.0.0.1') {
        next();
    } else {
        res.json({ Permiso: 'Denegado' });
    }
}


//LOGIN

userCTRL.loginUser = async (req, res) => {
    if (!req.body) {
        res.status(200).send({
            Message: 'Error inesperado'
        });
    }else{
        let user = new User()
        user.password = req.body.password;
        user.email = req.body.email;
        const userbbdd = await User.findOne({ email: user.email });
               
        if (userbbdd == null) {
            res.status(200).send({
                Message: 'Email no encontrado'
            });
        } else {
            if(!passwordHash.verify(user.password, userbbdd.password)){
                res.status(200).send({
                    Message: 'Email o password erroneos'
                });
            }else{
                var token = jwt.sign(userbbdd.toJSON(), JWT_Secret);
                res.status(200).send({
                    //signed_user: userbbdd,
                    Message: 'Usuario encontrado',
                    token: token
                });
            }
        }
    } 
}


//TOKEN VERIFY

userCTRL.verifyToken = async (req, res, next) => {
    jwt.verify(req.params.token, JWT_Secret, function (err, decoded) {
        if (err) {
            console.log(err);
            res.status(200).send({
                Message: 'Token no autorizado',
            });
            return false;
        }
        if (decoded) {
            console.log(decoded);
            res.status(200).send({
                Message: 'Token autorizado',
            });
            
            return decoded;
        }
    });
}

userCTRL.getToken = async (req, res, next) => {
let user=new User(req.body);
console.log("USER")
console.log(user)
var token = jwt.sign(user.toJSON(), JWT_Secret);
    res.status(200).send({
    Message: 'Usuario',
    token: token
    });
}


//CREATE REGISTER USER

userCTRL.createUser = async (req, res) => {
    const user = new User(req.body);
    let iguales = await getEqualsMails(user.email);
    if (iguales != null) {
        res.status(200).send({
            Message: 'Email ya registrado'
        });
    } else {
        user._id = mongoose.Types.ObjectId();
        user.password = passwordHash.generate(user.password);
        
        let resul = await user.save();
        //console.log(resul);
        if (resul == null) {
            res.status(500).send({
                Message: 'Error al crear el registro'
            });
        } else {
            
            let email_resul = await sendMail(user.email, user._id,'register');
            console.log(email_resul)
            if (email_resul == true) {
                let pasar = createFoldersUser(req.ip, user._id);
                if (pasar == 'NO') {
                    res.status(200).send({
                        Message: 'Error al crear el registro'
                    });
                } else {
                    
                    res.status(200).send({
                        Message: 'Registro completado'
                    });
                }
            }
        }
    }
}

//DELETE REGISTER

userCTRL.deleteUser = async (req, res) => {
    let resul = await User.findByIdAndDelete(req.params.id);
    if (resul == null) {
        res.status(500).send({ errorMessage: 'Error al crear al borrar el registro' });
    } else {
        res.status(200).send({ Message: 'Registro borrado' });
    }
}


//ACTIVE REGISTER

userCTRL.activateUser = async (req, res) => {
    let resul = await User.findByIdAndUpdate(req.params.token, {$set: {active:true } });
    if (resul == null) {
        res.status(500).send({ errorMessage: 'Error al crear al actualizar el registro' });
    } else {
        res.status(200).send({ Message: 'Registro actualizado' });
    }
}


//FORGOT MAIL

userCTRL.forgotMailUser = async (req, res) => {
    const user = new User();
    user.email = req.params.token
    
    const userbbdd = await User.findOne({ email: user.email });
    if (userbbdd == null) {
        res.status(200).send({ Message: 'Email no encontrado' });
    } else {
        let email_resul = await sendMail(user.email,userbbdd._id,'forgot');
        
        if (email_resul == false) {
            res.status(200).send({ Message: 'Error inesperado' });
        }else{
            res.status(200).send({ Message: 'Email de recuperación enviado' });
        }
    }
}


//UPDATE PASSWORD

userCTRL.changePassword = async (req, res) => {
    let user=new User(req.body);
    let passwordNew = passwordHash.generate(user.password);
    let resul = await User.findByIdAndUpdate(user._id,{$set: { password:passwordNew } });
    if (resul == null) {
        res.status(500).send({ errorMessage: 'Error al crear al actualizar el registro' });
    } else {
        res.status(200).send({ Message: 'Registro actualizado' });
    }
}


//UPDATE REGISTER

userCTRL.updateUser = async (req, res) => {
    let user=new User(req.body);
    
    let resul = await User.findByIdAndUpdate(user._id, { $set: user }, { new: true });
    if (resul == null) {
        res.status(200).send({ errorMessage: 'Error al crear al actualizar el registro' });
    } else {
        res.status(200).send({ Message: 'Registro actualizado' });
    }
}


//FIND ALL REGISTERS

userCTRL.findAllUser = async (req, res) => {
    const user = await User.find();
    res.json(user);
}


//FIND REGISTER BY ID

userCTRL.findUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
}
//FIND EQUALS MAILS

async function getEqualsMails(email) {
    return await User.findOne({ email: email }, (err, user) => {
        if (user) {
            return user.email;
        } else {
            return err;
        }
    });
}

//SEND MAIL

function sendMail(email, token,type) {
    if (true) {
        return main(email, token,type);
    }
    async function main(email, token,type) {
        var retorno;
        let enlace="";
        let titulo="";
        let texto="";
        let sub="";
        if(type=='register'){
            enlace="/auth/emailverify/";
            titulo="Último paso";
            texto="Para completar el último paso debes validar tu email";
            textoBoton="Valida tu email";
            sub='Has completado el primer paso del registro';
        }
        if(type=='forgot'){
            enlace="/auth/forgot/";
            titulo="Nueva contraseña";
            texto="Pincha en en enlace para cambiar tu contraseña";
            textoBoton="Cambiar contraseña";
            sub='Has completado el primer paso del registro';
        }
       

        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            //port: 587,
            secure: true,
            auth: {

                user: "instaclone77@gmail.com",
                pass: "losalosa"
            }
        });
        

        let info = await transporter.sendMail({
            //from: 'InstaClone.com <pruebas@gmail.com>',
            //replyTo: 'noreply.losmaralerestaurante@gmail.com',
            from: 'InstaClone.com <instaclone77@gmail.com>',
            replyTo: 'noreply.instaclone77@gmail.com',
            to: email,
            subject: 'Has completado el primer paso del registro',
            text: 'Hola',
            html: "<meta http-equiv='X-UA-Compatible' content='IE=edge' /> <meta name='viewport' content='initial-scale=1.0' /> <meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><body style='margin:0; padding:0;' bgcolor='#efefef'> <table width='650' border='0' cellspacing='0' cellpadding='0' align='center' bgcolor='#ffffff' style='padding:0;'> <tr> <td align='center'> <table width='600' border='0' cellspacing='0' cellpadding='0' align='center' bgcolor='#ffffff' style='padding:0;'> <tr> <img src='https://www.elbarqr.com/assets/Instagram-Banner2.png' width='650' alt='elbar' style='border-bottom:5px solid rgba(252,70,107,1);'> </tr> <tr> <td height='40'>&nbsp;</td> </tr> <tr> <td align='center'> <p style='color:rgba(252,70,107,1); font-family:Arial, Verdana, Geneva, sans-serif; font-size:33px; text-align:center; font-weight:bold'>"+titulo+"</p> </td> </tr> <tr> <td height='40'>&nbsp;</td> </tr> <tr> <td align='center'> <p style='color:#000000; font-family:Arial, Verdana, Geneva, sans-serif; font-size:17px; text-align:center;'>"+texto+"<br></p> </td> </tr> <tr> <td height='40'>&nbsp;</td> </tr> <tr> <td align='center'> <table width='200' border='0' cellspacing='0' cellpadding='0' align='center' style='margin:0; margin-bottom:10px; padding:0; border:3px solid rgba(252,70,107,1);-webkit-border-radius: 19px; -moz-border-radius: 19px; -ms-border-radius: 19px; -o-border-radius: 19px; border-radius:19px;'> <tr> <td height='35' width='30'>&nbsp;</td> <td height='35' align='center'><span style='color:#ffffff; font-family:Arial, Verdana, Geneva, sans-serif; font-size:20px; text-align:center; text-decoration:none;'><b><a style='text-decoration:none;color:rgba(252,70,107,1);' href='"+ruta+""+enlace+""+token+"'>"+textoBoton+"</a></b></span></td> <td height='35' width='30'>&nbsp;</td> </tr> </table> </td> </tr> <tr> <td height='20'>&nbsp;</td> </tr> <tr></tr> <tr> <td height='60'>&nbsp;</td> </tr> </table> </td> </tr> <tr> <td align='center' bgcolor='#FC466B' height='39'>&nbsp;</td> </tr> </table> <p>&nbsp;</p> <p>&nbsp;</p> </body>"
        });
        console.log('Message sent: %s', info.messageId);
        (info)? retorno=true :retorno=false;
        return retorno;
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    main().catch(console.error);
}


//CREATE FOLDERS USER

function createFoldersUser(ipl, id) {
    let rutaCarpeta = [];
    let dir="server/dist/frontend/assets/";

    if (fs.existsSync(dir)) {
        rutaCarpeta[0] = 'server/dist/frontend/assets/users/' + id;
        rutaCarpeta[1] = 'server/dist/frontend/assets/users/' + id + '/photos';
    } else {
        rutaCarpeta[0] = 'frontend/src/assets/users/' + id;
        rutaCarpeta[1] = 'frontend/src/assets/users/' + id + '/photos';
    }

   
    let pasar = 'SI';
    for (let i = 0; i < rutaCarpeta.length; i++) {
        setTimeout(()=>{
            fs.mkdir(rutaCarpeta[i], function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    pasar = 'NO';
                }
            });
        },5000)
    }
    return pasar;
}

//CREATE IMAGES

userCTRL.photoUpload = (req, res) => {
    console.log(req.body)
    let ip = req.ip.split(':');
    var form = new formidable2.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        let id_nombreFile = file.name.split('-');
        file.path = 'tmp/' + id_nombreFile[0];
    });
    form.on('file', function (name, file) {
        let id_nombreFile = file.name.split('-');
        file.name = id_nombreFile[1];
        var ruta_photos = '';
        ruta_photos = 'server/dist/frontend/assets/users/' + id_nombreFile[0] + '/photos/';
        console.log('Uploaded ' + file.name);
        (async () => {
            const files = await imagemin(['tmp/' + file.name], {
                destination: ruta_photos,
                plugins: [
                    imageminJpegtran(),
                    imageminMozjpeg({ quality: 10 }),
                    imageminPngquant({
                        quality: [0.1, 0.3]
                    })
                ]
            });
            try {
                fs.unlinkSync('tmp/' + file.name);
            } catch (err) {
                console.error(err)
            }
        })();
        res.send(file.name);
    });
}


userCTRL.imgPhotos = (req, res) => {
    
    let ip = req.ip.split(':');
    var form = new formidable2.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file) {
        let id_nombreFile = file.name.split('-');

        if(id_nombreFile.length==3){
            file.path = 'tmp/' + id_nombreFile[1]+id_nombreFile[2];
        }

        if(id_nombreFile.length==2){
            file.path = 'tmp/' + id_nombreFile[1];
        }
        
    });
    form.on('file', function (name, file) {
        console.log(file)
        let id_nombreFile = file.name.split('-');
        console.log(id_nombreFile)
        if(id_nombreFile.length==3){
            file.name = id_nombreFile[1]+id_nombreFile[2];
        }

        if(id_nombreFile.length==2){
            file.name = id_nombreFile[1];
        }

        //file.name = id_nombreFile[1];
        var ruta_photos = '';
        ruta_photos = 'server/dist/frontend/assets/users/' + id_nombreFile[0] + '/photos/';
        console.log(ruta_photos)
        //ruta_photos = 'frontend/src/assets/user/' + id_nombreFile[0] + '/photos/';
        console.log('Uploaded ' + file.name);
        (async () => {
            const image = await resizeImg(fs.readFileSync('tmp/' + file.name), {
                width: 2028,
                height: 528
            });
         
            fs.writeFileSync(ruta_photos+""+file.name, image);
        })();
        (async () => {
            const files = await imagemin(['tmp/' + file.name], {
                destination: ruta_photos,
                //plugins: [
                //    imageminJpegtran(),
                //    imageminMozjpeg({ quality: 10 }),
                //    imageminPngquant({
                //        quality: [0.7, 0.9]
                //    })
                //]
            });
            try {
                fs.unlinkSync('tmp/' + file.name);
            } catch (err) {
                console.error(err)
            }
        })();
        console.log(file.name)
        if(id_nombreFile.length==3){
            res.send('./assets/users/' + id_nombreFile[0] + '/photos/'+id_nombreFile[1]+id_nombreFile[2]);
        }

        if(id_nombreFile.length==2){
            res.send('./assets/users/' + id_nombreFile[0] + '/photos/'+id_nombreFile[1]);
        }

        
    });
}
module.exports = userCTRL;