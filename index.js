// express 모듈을 가져온다.
const express = require('express');
// 가져온 express 모듈의 function을 이용하여 express app을 만든다.
const app = express();
// 포트번호 지정
const port = 5000;

// mongoose 연결
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:java@boilerplate-2lwj3.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoose connent!'))
.catch(err => console.log(err));

// body-parser
const bodyParser = require('body-parser');

// user model 가져오기
const { User } = require("./models/User");

// Body-parser의 option
// aplication/x-www-form-urlencoded 형태를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// application/json 형태를 분석해서 가져옴
app.use(bodyParser.json());

// Root
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// Register Router
app.post('/register', (req, res) => {

    // 회원가입 할 때 필요한 정보들을 Client에서 가져오면 
    // 그것들을 데이터베이스에 넣어준다. -> user Model을 가져와야 한다.

    // req.body안에는 body-parser 덕분에 user의 json형식으로 정보가 저장되어 있다.
    const user = new User(req.body)
    
    // mongo DB에 저장하기
    user.save((err, userInfo) => {
        if (err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
});