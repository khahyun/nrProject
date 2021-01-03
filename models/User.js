const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//salt 를 이용해서 비밀번호를 암호화. saltrounds글자수 salt를 먼저생성. 
const saltRounds = 10

const jwt = require('jsonwebtoken');

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


//비밀번호 비교
userSchema.methods.comparePassword = function(plainPassword, cb){

    //plain을 다시 암호화해서 디비 비번이랑 비교해야한다.

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err); 
        cb(null, isMatch);
    })
}

//토큰생성
userSchema.methods.generateToken = function(cb){
    var user = this;
    // json web token 이용하여 token 생성하기
    // user._id 와 두번째 param 으로 토큰을 만들고, param 을 이용하여 나중에 userid를 찾아낸다. 
    // user._id + 'secretToken' = token    
    // 나중에 token으로 user._id를 찾을 수 있다.
                            //plain object로 만들기
  var token = jwt.sign(user._id.toHexString(), "secretToken")

  user.token = token
  user.save( function (err, user) {
   if(err) return cb(err);
   cb(null,user);
})
}

userSchema.statics.findByToken = function ( token, cb){
    var user = this;
    //복호화
    jwt.verify(token, 'secretToken', function(err, decoded){
        //decoded 가 _id
             //findOne 몽고디비 method
        user.findOne({"_id" : decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);

        })
    })
}
//다른 곳에서도 쓸 수 있도록
const User = mongoose.model('User', userSchema)

module.exports = { User }