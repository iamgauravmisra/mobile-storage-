const express = require('express');
const router = express.Router();
const { getMobiles, addMobile, deleteMobile, processSale } = require('../controllers/mobileController');

router.route('/').get(getMobiles).post(addMobile);
router.post('/buy/:id', processSale);
router.delete('/:id', deleteMobile);

module.exports = router;