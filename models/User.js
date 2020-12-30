const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//salt 를 이용해서 비밀번호를 암호화. saltrounds글자수 salt를 먼저생성. 
const saltRounds = 10


const userSchema = mongoose.Schema({
        name: {
            type: String,
            maxlength: 50
        },
        email: {
            type: String,
            trim: true,
            unique: 1
        },
        password: {
            type: String,
            minlength: 5
        },
        lastname: {
            type: String,
            maxlength: 50
        },
        role: {
            type: Number,
            default: 0
        },
        image: String,
        token: {
            type: String
        },
        tokenExp: {
            type: Number
        }
    })

    //save 전에 함수실행한다.
    userSchema.pre('save', function (next) {
        var user = this;

        //다른것들 수정할때는 실행 ㄴ 비번 변경시에만 암호화한다!
        if (user.isModified('password')) {
            //비밀번호를 암호화 시킨다.
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) return next(err)

                              //입력한 비밀번호                   //암호화된 비밀번호
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) return next(err)
                    user.password = hash
                    next()
                })
            })
        } else {
            next()
        }
    })


//다른 곳에서도 쓸 수 있도록
const User = mongoose.model('User', userSchema)

module.exports = { User }