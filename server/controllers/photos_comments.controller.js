const Photos_comments = require('../models/photos_comments.model');
const mongoose = require('mongoose');
const formidable2 = require('formidable');
const fs = require('fs');
photos_commentsCTRL = {};


//CONTROLIP

photos_commentsCTRL.controlIP = async (req, res, next) => {
    let ip = req.ip.split(':');
    /*console.log(ip[3]);*/
    if (req.ip == '::1' || ip[3] == '138.68.153.191' || ip[3] == '127.0.0.1') {
        next();
    } else {
        res.json({ Permiso: 'Denegado' });
    }
}


//CREATE REGISTER

photos_commentsCTRL.createPhotos_comments = async (req, res) => {
    const photos_comments = new Photos_comments(req.body);
    photos_comments._id = mongoose.Types.ObjectId();
    let resul = await photos_comments.save();
    if (resul == null) {
        res.status(200).send({ errorMessage: 'Error al crear el registro' });
    } else {
        res.status(200).send({ Message: 'Registro completado' });
    }
}


//DELETE REGISTER

photos_commentsCTRL.deletePhotosComment = async (req, res) => {
    let photos_comments = new Photos_comments();
    photos_comments._id=req.params.token;
    let resul = await Photos_comments.findByIdAndDelete(photos_comments._id);
    if (resul == null) {
        res.status(200).send({ Message: 'Error al crear al borrar el registro' });
    } else {
        res.status(200).send({ Message: 'Registro borrado' });
    }
}


//UPDATE REGISTER

photos_commentsCTRL.updatePhotos_comments = async (req, res) => {
    let resul = await Photos_comments.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (resul == null) {
        res.status(500).send({ errorMessage: 'Error al crear al actualizar el registro' });
    } else {
        res.status(200).send({ Message: 'Registro actualizado' });
    }
}


//FIND ALL REGISTERS

photos_commentsCTRL.findAllPhotos_comments = async (req, res) => {
    const photos_comments = await Photos_comments.find();
    res.json(photos_comments);
}


//FIND REGISTER BY ID

photos_commentsCTRL.getPhotosComments = async (req, res) => {
    let photo_comments = new Photos_comments();
    photo_comments._id_photo=req.params.id_photo;
    console.log(req.params.id_photo)
    const photos_comments = await Photos_comments.find({_id_photo:photo_comments._id_photo}).sort( { date: -1 } );
    if (photos_comments == null) {
        res.status(200).send({ Message: 'Error en la busqueda' });
    } else {
        res.status(200).send({ Message: 'Busqueda completada',comments:photos_comments });
    }
    
}
//CREATE FOLDERS USER

module.exports = photos_commentsCTRL;