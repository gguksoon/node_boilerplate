const mongoose = require('mongoose');

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

// Schema를 Model로 감싼다
const User = mongoose.model('User', userSchema);

// User Model이 다른 곳에서도 쓰일 수 있게 export 한다
module.exports = { User };