var User = require("../models/User.js");
var UserSession = require("../models/UserSession");

const mongoose = require('mongoose');

module.exports = {
    create: (req, res, next) => {

        console.log(req.body);
        let { username, email, password } = req.body;

        if (!username) {
            return res.send({
                success: false,
                message: "Error : username cannot be blank"
            });

        }

        if (!email) {
            return res.send({
                success: false,
                message: "Error : email cannot be blank"
            });

        }

        if (!password) {
            return res.send({
                success: false,
                message: "Error : password cannot be blank"
            });

        }


        email = email.toLowerCase();

        User.find({
            email: email
        }), (err, previousUsers) => {
            if (err) {
                return res.send('Error : Server error');
            } else if (previousUsers.length > 0) {
                return res.send('Error : Account already exist.')
            }
        }

        const newUser = new User({

            email: email,
            username: username,
            password: password


        }).save()
            .then((user) => {

                
                res.status(200).send("user has been created succesfully " + user.username);


            }).catch(err => console.log(err));


        //   Project.saved = true;
        // console.log(query);
        // return User.collection.save(query, { ordered: false }, function (err, docs) {
        //     // returns any errors without blocking the scraping

        //     console.log(docs + "Docs");
        //     cb(err, docs, query);
        // });

        // users need to be validated at this point by the creator

    },


    signIn: (req, res, next) => {

        console.log(req.body);


        User.findOne({
            email : req.body.email
        }).then( user => {

            
                if (user.length > 0) {
                return res.send('Error : Account already exist.')
            }
            // console.log(user.map(user => user.username));

            console.log(user._id);


            let userSession = new UserSession({
                userId: user._id,
                username : user.username

            })
                .save()
                .then(doc => {
                    console.log(doc);

                    res.status(200).send({
                        success: true,
                        message: "Valid sign in",
                        token: doc._id,
                        username : doc.username
                    })

                }).catch( err => console.log(err))

        }).catch( err => console.log(err))

    },


    // req.params contains route parameters (in the path portion of the URL), and req.query 
    //contains the URL query parameters (after the ? in the URL).

    verify: (req, res, next) => {
        console.log(req);
        const { token } = req.query;
        console.log(token);


        UserSession.findOne({ _id : token })
        .then((session) => {

            console.log(session);

            res.send({message :"session found", status : "good", userId : session.userId , username : session.username});

        }).catch(err => console.log(err))
        
    },


    logout : (req,res, next) => {
        const { token } = req.query;


        UserSession.findOneAndUpdate({
            _id : token
        }, { $set : { isDeleted : true}}, {new : true})

        .then((session) => {
            console.log(session);
            res.send("session has been deleted" + session);


        })


    },


    delete: function (query, cb) {
        console.log(query);
        User.deleteOne({ _id: query.id }, cb);
    },

    // gets everything in the schema
    get: function (query, cb) {

        console.log(query);

        User.find(query)
            .populate('Project')

            .sort({
                _id: -1
            })
            .exec(function (err, docs) {
                cb(err, docs);
            })
    },



    // gets all content from an specific field
    // gets either all collaborations or all projects
    getSpecific: function (query, cb) {

        //projection
        User.find({ _id: query.id }, query)
            .sort({
                _id: -1
            })
            .exec(function (err, docs) {
                cb(err, docs, query);
            })
    },

    update: function (query, cb) {
        Project.updateOne({ _id: query.id }, {
            $set: query
        }, {}, cb);
    }
}

