const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

//스키마 생성
const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    
    email : {
        type : String,
        //trim은 문자열 내 공백을 없애준다.
        trim : true,
        //유일한 값
        unique : 1
    },

    password : {
        type : String,
        minlength : 5
    },

    lastname : {
        type : String,
        maxlength : 50
    },

    role : {
        type : Number,
        default : 0
    },

    image : String,

   // 유효성 검사에 사용
    token : {
        type : String
    }, 
	
    // 토큰이 유효한 시간
    tokenExp : {
        type : Number
    }
});

// user 정보를 저장하기 전에 실행(/signup에서 user.save하기 전에)
userSchema.pre('save', function(next) {
    // 현재 user 정보
    var user = this;

    // 비밀번호가 변경될 때만 수행
    if(user.isModified('password')) {
        // 비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){
            // 에러 발생 시 err를 가지고 save로 돌아감
            if(err) return next(err);

            // hash로 비밀번호 암호화
            bcrypt.hash(user.password, salt, function(err, hash) {
                // 에러 발생 시 err를 가지고 save로 돌아감
                if(err) return next(err);
                user.password = hash;

                // save 로 돌아가기
                next();
            })
        })
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword: 123456
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch); // 에러가 없고 비밀번호가 같다
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user) {
        // 에러가 있으면
        if(err) return cb(err);
        // 에러가 없으면
        cb(null, user)
    });
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode(jwt)
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user) { // 몽구스 메서드
            // 에러가 있으면
            if(err) return cb(err);
            // 에러가 없으면
            cb(null, user);
        });
    });
}

// Schema를 Model로 감싼다
const User = mongoose.model('User', userSchema);

// User Model이 다른 곳에서도 쓰일 수 있게 export 한다
module.exports = { User };