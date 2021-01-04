const { User } = require('../models/User');

let auth = (req, res, next) =>{
    //인증 처리 하는 곳

    //클라이언트 쿠키에서 토큰을 가져온다. cookieParser

    let token = req.cookies.x_auth;

    //토큰 복호화해서 user 찾기. users 에서 method를 만들어서...
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth : false, error: true})

        //req에 넣는 이유는..다른곳에서도 쓸 수있도록.
        req.token = token;
        req.user = user;
        next();
    })

}

module.exports = {auth};