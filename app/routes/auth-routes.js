const router = require('express').Router();
const passport = require('passport');
const UserController = require("../controllers/users");


// auth singup
router.post('/account/signup', UserController.create);


//auth signin

router.post('/account/signin', UserController.signIn);


router.get('/account/verify/:token?', UserController.verify);

router.get('/account/logout', UserController.logout);





// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    // req.logout();
    res.redirect('/');
    localStorage.removeItem('user');
});



// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//callback route for goole to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {

    console.log("user model google  " + req.user.email);

    if (typeof localStorage === "undefined" || localStorage === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
      }
     
       
      localStorage.setItem('user', JSON.stringify(req.user));
    //   console.log(localStorage.getItem('user'), "this is local storage!!!!!!!");

   
    //res.send(req.user);
    // res.redirect('https://thegigmaker.herokuapp.com/dashboard');
    res.redirect('http://localhost:3000/dashboard');


});

module.exports = router;