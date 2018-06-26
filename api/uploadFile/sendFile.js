const multer = require('multer');
const path = require('path');

function sendFile(req, res, next) {
    // Set Storage Engine
    var storage = multer.diskStorage({
        destination: './public/avatar',
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + 
            path.extname(file.originalname))
        }
    });
    var upload = multer({ storage: storage }).single('avatar');

    upload(req, res, (err) => {
        if(err){
            console.log(err)
            res.render('index', {
                msg: err
            })
        }res.json({
            success: true,
            message:'Image uploaded!'
       })
    })
};

module.exports = { sendFile } 
