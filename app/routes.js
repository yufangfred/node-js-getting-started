// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        console.log(__dirname);
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // process update matches
    app.get('/update_matches', (req, res) => {
        usePython();
        res.render('update_matches');
    });

    app.get('/run_py', (req, res)=>{
        var myPythonScriptPath = 'script.py';

        // Use python shell
        var PythonShell = require('python-shell');
        var pyshell = new PythonShell("pyscripts/test.py");

        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            console.log(message);
        });

        // end the input stream and allow the process to exit
        pyshell.end(function (err) {
            if (err){
                throw err;
            };

            //console.log('finished');
        });
    });


    app.get('/run_py2', (req, res)=>{
        var PythonShell = require('python-shell');
     
        var options = {
          mode: 'text',
          pythonPath: 'python3',
          pythonOptions: ['-u'],
          args: ['value1', 'value2', 'value3']
        };
         
        PythonShell.run('pyscripts/test.py', options, function (err, results) {
          if (err) throw err;
          // results is an array consisting of messages collected during execution 
          console.log('results: %j', results);
        });



    });

    app.get('/matchticker', (req, res)=>{
        var PythonShell = require('python-shell');
     
        var options = {
          mode: 'text',
          pythonPath: 'python3',
          pythonOptions: ['-u'],
          args: ['value1', 'value2', 'value3']
        };
         
        PythonShell.run('pyscripts/matchticker.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution 
            console.log('results: %j', results);

            const fs = require('fs');

            let rawdata = fs.readFileSync('matchticker.json');  
            let student = JSON.parse(rawdata); 
            //console.log("TEEHEE"); 
            //console.log(student);
            //let obj = JSON.parse(student);
            console.log(student.games);
            res.render('pages/matchticker.ejs' , {
                tickerjson: student
            });

        });
    });


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function usePython() {
    var spawn = require("child_process").spawn;
    var process = spawn('python',["pyscripts/getmatches.py"]);

    process.stdout.on('data', function (data){
        // Do something with the data returned from python script

        //console.log(data.tostring());
        console.log(data.toString('utf8'));
        console.log('caught on javascript');

    });
}