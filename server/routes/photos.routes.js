const express = require('express');
const photosCTRL = require('../controllers/photos.controller');
const router = express.Router();


//router.post('/create',photosCTRL.controlIP);
router.post('/create',photosCTRL.createPhotos);
//router.delete('/delete/:token',photosCTRL.controlIP);
router.delete('/delete/:token',photosCTRL.deletePhotos);
//router.put('/update/:token',photosCTRL.controlIP);
router.put('/update/:token',photosCTRL.updatePhotos);
//router.get('/getAll',photosCTRL.controlIP);
router.get('/getAll',photosCTRL.findAllPhotos);
//router.get('/getAllPhotosUser/:token',photosCTRL.controlIP);
router.get('/getAllPhotosUser/:token',photosCTRL.getAllPhotosUser);

//router.get('/getPhotosWithComments/:token',photosCTRL.controlIP);
router.get('/getPhotosWithComments/:token',photosCTRL.getPhotosWithComments);
//router.get('/getPhotosWithOutComments/:token',photosCTRL.controlIP);
router.get('/getPhotosWithOutComments/:token',photosCTRL.getPhotosWithOutComments);

//router.get('/get',photosCTRL.controlIP);
router.get('/get',photosCTRL.findPhotos);


module.exports = router;