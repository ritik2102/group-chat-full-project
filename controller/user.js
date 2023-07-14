const bcrypt=require('bcrypt');
const User=require('../model/user');

exports.postUser = (req, res, next) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const mobile=req.body.mobile;
        const password = req.body.password;

        // console.log(name,email,mobile,password);
        bcrypt.hash(password, 10, (err, hash) => {
            User.create({ name: name, email: email,mobile:mobile, password: hash})
                .then(result => {
                    res.status(201).json({ resData: "success" });
                })
                .catch(err => {
                    const error = err.errors[0].message;
                    res.status(201).json({ resData:"duplicate"});
                })
        })
    }
    catch (err) {
        throw new Error(err);
    }
}