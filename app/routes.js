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
        let betting_record = require('./models/bet_record');
        betting_record.find({usr_id : req.user._id}, (err, record) => {
            if (err) throw err;

            res.render('profile.ejs', {
                user : req.user, // get the user out of session and pass to template
                records: record
            });        
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
        successRedirect : '/matchticker', // redirect to the secure profile section
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
    
    /* 
    Upon recieving the place bet request. 
    1: recieve the request;
    2: create a beting record in the database (usrname, bet_on, amount, match_data, etc)
    3. update user balance
    4. take to confirm betting page shows user balance and betting result.
    */
    app.post('/placebet', (req, res) => {

        console.log('received placebet request');

        console.log('You sent sweep cash "' + req.body.whichteam + '".');
        console.log('You sent sweep cash "' + req.body.JSONSTRING + '".');
        console.log('You sent sweep cash "' + req.body.moneybet + '".');
        console.log('Current_user'+ req.user._id);
        let match = JSON.parse(req.body.JSONSTRING);

        let betting_record = require('./models/bet_record');
        let User = require('./models/user');

        // create a new match-betting record
        let new_record = new betting_record({
              team2: {
                bet: match["team 2"].bet,
                name: match["team 2"].name
              },
              tournament: match.tounament,
              simple_title: match.simple_title,
              team1: {
                bet: match["team 1"].bet,
                name: match["team 1"].name
              },
              url: match.url,
              game: match.game,
              meta: req.body.JSONSTRING,
              bet_on: req.body.whichteam,
              amount: req.body.moneybet,
              usr_id: req.user._id
        });

        // save the betting record
        new_record.save(function(err) {
          if (err) throw err;
          betting_record.find({}, function(err, users) {
              if (err) throw err;

              // object of all the users
              //console.log(users);
         });
        }); 

        //update the user balance
        User.findOneAndUpdate({ _id: req.user._id }, { $inc: { balance: -req.body.moneybet } }, function(err, user) {
          if (err) throw err;
        });

        res.render('pages/confirm.ejs', {
            team: req.body.whichteam,
            json_string: req.body.JSONSTRING,
            moneybet: req.body.moneybet
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