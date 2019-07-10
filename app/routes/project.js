


const express = require("express");
const router = express.Router();

const db = require("../models/index");

const mongoose = require('mongoose');

const Collaborator = ('../models/collaborator');

const Project = require('../models/Projects');
const User = require('../models/User');


// Project Crud actions


// Create project



// Home route
router.get("/", function (req, res) {
    res.send("hello there!");
});




// getting all or a particular project based on Id

router.get("/all/:projectId?", function (req, res) {
    var query = {};

    if (req.params.projectId) {
        query._id = req.params.projectId;
    }

    console.log(query);

    Project.find({ userId: query._id })
        .populate('gigster')
        .exec()
        .then(dbProjects => {

            console.log('herro ' + dbProjects);

            res.status(200).json({
                message: "Project(s) has been found!",
                data: dbProjects

                // populatedProject: dbProjects.map(doc => {



                //     // getting project Id
                //     // let projectId = doc.projects.map(projectId => projectId._id)



                //     console.log(doc);

                //     return {

                //         gigster: doc.gigster,
                //         _id: doc._id,
                //         userId: doc.userId,
                //         notifications: doc.gigster.notifications,
                //         approved: doc.gigster.approved,
                //         projectId: doc.gigster.projectId,
                //         url : "http://localhost:3001/projects/all/" + doc._id
                //     }


            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Project was not found",
                error: err
            })
        })
});



router.get("/everything", function (req, res) {
    var query = {};

    if (req.params.projectId) {
        query._id = req.params.projectId;
    }

    console.log(query);

    Project.find()
        .populate('gigster')
        .exec()
        .then(dbProjects => {

            console.log('herro ' + dbProjects);

            res.status(200).json({
                message: "Project(s) has been found!",
                data: dbProjects

                // populatedProject: dbProjects.map(doc => {



                //     // getting project Id
                //     // let projectId = doc.projects.map(projectId => projectId._id)



                //     console.log(doc);

                //     return {

                //         gigster: doc.gigster,
                //         _id: doc._id,
                //         userId: doc.userId,
                //         notifications: doc.gigster.notifications,
                //         approved: doc.gigster.approved,
                //         projectId: doc.gigster.projectId,
                //         url : "http://localhost:3001/projects/all/" + doc._id
                //     }


            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Project was not found",
                error: err
            })
        })
});

// });

//logined user
//passport gives you the user ID to be referenced later, need to send a key of UserID
// const project = new Project({
//     name: req.body.name
// }).save(function(err, saved_project){
//     User.findOneandUpdate({_id: req.user.id}, {$push: {projects: saved_project._id}}), function(err, user){

//     })
// })



// create new project and save it in the users projects array (creator)

router.post("/create", function (req, res) {
    const newProject = req.body;

    console.log(newProject);

    Project.create(newProject)
        .then(dbProject => {

            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { projects: dbProject } }, { new: true })
                .then(dbUser => {
                    res.status(200).json({

                        message: "Project was created succesfully!",
                        Project: dbUser
                    });
                });
        })
        .catch(err => {

            res.status(500).json({

                message: "Project was not created succesfully please try again",
                error: err
            });

        });

});





// delete a project by Id (creator)
router.delete("/delete/:projectId", function (req, res) {

    console.log(req.params.projectId);

    Project.deleteOne({ _id: req.params.projectId }, function (err, data) {

    //     Collaborator.deleteOne({projectId : req.params.projectId}).then((res) => {

    //  
           console.log("collaboartor deleted" + res )

    if (data) {
    res.status(200).json({

        message: 'project has been deleted',
        data : data


    })

} else {
    res.status(200).json({

        message: 'project has not been deleted',
        error : err


    })

}

      
     

    })

})


// update content (creator)
// do we need to send back updated info?
router.put("/update/:projectId?", function (req, res) {

    // console.log(req.params.projectId);

    var query = req.body;

    console.log(query);

    Project.update({ _id: query.id }, { $set: { title: query.title, location: query.location, description: query.description } }, { new: true }, function (err, data) {
        if (data) {
            res.status(200).json({
                message: "project has been updated!",
                data: data

            });
        } else {
            console.log(err);
            res.redirect("/");

        }

    });
});



//projectId and user Id aka (gigster ID)
// all the projects contain the User id (gigmaker)
// front end passport sends project Id and User ID
// The gigmaker get a request in the projects updated gigster arrays


// need gigmaker userId 
// need gigster userId













module.exports = router;