var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var app = express();

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(passport.initialize());
//session
app.set('trust proxy', 1) ;// trust first proxy
app.use(session({
  secret: "secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.session());

//set view
app.set('views', './views');
app.set('view engine', 'ejs');
//controller
var controllers=require(__dirname+"/controllers");
app.use(controllers);

app.get('/loginOK', (req, res) => res.send('Thành công'));

// app.route('/login').get((req,res) => res.render('login'))
// .post(passport.authenticate('local', {
//     failureRedirect: '/login',
//     successRedirect: '/loginOK'
// }));

passport.serializeUser((username, done) => {
    done(null, username);
});

passport.deserializeUser((name, done) => {
    //tại đây hứng dữ liệu để đối chiếu
    if (name == 'user') { //tìm xem có dữ liệu trong kho đối chiếu không
        return done(null, name);
    } else {
        return done(null, false);
    }
});

passport.use(new localStrategy(
    (username, password, done) => {
         //các tên - name trường cần nhập, đủ tên trường thì Done 
        if(username == 'user') { //kiểm tra giá trị trường có name là username
            if (password == 12345) { // kiểm tra giá trị trường có name là password
                return done(null, username); //trả về username
            } else {
                return done(null, false); // chứng thực lỗi
            }
        } else {
            return done(null, false); //chứng thực lỗi
        }
    }
));


app.listen(3000, function(){
    console.log("Server run on port 3000");
});