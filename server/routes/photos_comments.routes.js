const express = require('express');
const photos_commentsCTRL = require('../controllers/photos_comments.controller');
const router = express.Router();

//router.post('/create',photos_commentsCTRL.controlIP);
router.post('/create',photos_commentsCTRL.createPhotos_comments);
//router.delete('/delete/:token',photos_commentsCTRL.controlIP);
router.delete('/delete/:token',photos_commentsCTRL.deletePhotosComment);
//router.put('/update/:token',photos_commentsCTRL.controlIP);
router.put('/update/:token',photos_commentsCTRL.updatePhotos_comments);
//router.get('/getAll',photos_commentsCTRL.controlIP);
router.get('/getAll',photos_commentsCTRL.findAllPhotos_comments);
//router.get('/get/:id_photo',photos_commentsCTRL.controlIP);
router.get('/get/:id_photo',photos_commentsCTRL.getPhotosComments);


module.exports = router;