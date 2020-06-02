// express 모듈을 가져온다.
const express = require('express');
// 가져온 express 모듈의 function을 이용하여 express app을 만든다.
const app = express();
// 포트번호 지정
const port = 5000;
// cookie-parser
const cookieParser = require('cookie-parser');
// body-parser
const bodyParser = require('body-parser');
// mongo uri를 암호화하여 사용하기 위한 config
const config = require('./config/key');
// user model 가져오기
const { User } = require("./models/User");
// auth 가져오기
const { auth } = require("./middleware/auth")

// cookie-parser의 option
app.use(cookieParser());

// body-parser의 option
// aplication/x-www-form-urlencoded 형태를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// application/json 형태를 분석해서 가져옴
app.use(bodyParser.json());

// mongoose 연결
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoose connent!'))
.catch(err => console.log(err));







// root router
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(process.env.PORT || port, function() {
    console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`process.env.PORT: ${process.env.PORT}`);
    console.log(`process.env.MONGOURI: ${process.env.MONGOURI}`);
});

// signup router
app.post('/api/users/signup', (req, res) => {

    // 회원가입 할 때 필요한 정보들을 Client에서 가져오면 
    // 그것들을 데이터베이스에 넣어준다. -> user Model을 가져와야 한다.

    // req.body안에는 body-parser 덕분에 user의 json형식으로 정보가 저장되어 있다.
    const user = new User(req.body);
    
    // mongo DB에 저장하기
    user.save((err, userInfo) => {
        if (err) {
            return res.json({success: false, err})
        }
        return res.status(200).json({
            success: true
        });
    });
});

// signin router
app.post('/api/users/signin', (req, res) => {
    // mongoose의 메서드(이메일 찾기)
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email}, (err, user) => {
        // 요청된 이메일이 없다면
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 이메일이 있다면
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
            }
            // 비밀번호가 맞다면 토큰 생성
            user.generateToken((err, user) => {
                // 에러가 있다면
                if(err) return res.status(400).send(err);

                // 토큰을 쿠키에 저장한다. (로컬스토리지, 세션 등도 가능)
                res.cookie("x_auth", user.token)``
                .status(200).json({loginSuccess: true, userId: user._id})
            });
        });
    });
});

// 주소를 받고 콜백함수(req, res)를 실행하기 전에 auth를 실행(미들웨어)
app.get('/api/users/auth', auth, (req, res) => {

    // 이 곳까지 미들웨어를 통과해 왔다는 것은 Authentication이 True라는 말
    res.status(200).json({
        _id: req.user.id, // auth에서 req.user에 넣음
        isAdmin: req.user.role === 0 ? false : true, // role 0: 일반유저, 나머지: 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

// signout router
app.get('/api/users/signout', auth, (req, res) => {
    // req.user._id는 미들웨어인 auth에서 저장함
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success: true
        });
    })
})