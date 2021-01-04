const { request } = require('express')
const express = require('express')
const app = express()
//function 을 사용해 app으로..
const port = 5000

//user모델가져오기
const bodyParser = require('body-parser') 
const cookieParser = require('cookie-parser') 
const config = require('./config/key');

const {User} = require("./models/User");
const {auth} = require("./middleware/auth");

//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello ...Whhorzzld!')
})

//회원가입을 위한 라우터
app.post('/api/users/register',(req,res) => {

    //회원가입할때 필요한 정보들을 클라이언트에서 가져오기. 디비에 넣기.
    const user = new User(req.body)
    
    
    //save 하기 전에 비밀번호를 암호화시켜야한다
    user.save((err, doc)=>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success : true
        })
    })
}) 

app.post('/api/users/login',(req, res) => {
  //요청된 이메일을 디비에서 찾기
  User.findOne({ email: req.body.email }, (err, user) =>{
    if(!user){
      return res.json({
        loginSuccess : false,
        message: "가입된 이메일이 없습니다."
      })
    }

                         //plain password
    user.comparePassword( req.body.password , (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      user.generateToken((err, user) => {
          if(err) return res.status(400).send(err)
          
            // token 을 쿠키에 저장한다
          res.cookie("x_auth", user.token)
            .status(200)
            .json({loginSuccess : true, userId : user._id})
            //json 으로 데이터 보내기!
      })
    })
  })
})


app.get('/api/users/auth', auth, (req, res) => {

  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true

  res.status(200).json({
    //전달 해주고 싶은 정보만 저장한다. auth.js 에서 user 저장했기때문에 사용가능.
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })

})

app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({_id: req.user._id},
    {token:""},(err, user) => {
      if(err) return res.json({ success : false, err});
      return res.status(200).send({
        success : true
    })
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})