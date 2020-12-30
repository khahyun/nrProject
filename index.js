const { request } = require('express')
const express = require('express')
const app = express()
//function 을 사용해 app으로..
const port = 5000

//user모델가져오기
const bodyParser = require('body-parser') 
const config = require('./config/key');

const {User} = require("./models/User")


//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello ...Whhorzzld!')
})

//회원가입을 위한 라우터
app.post('/register',(req,res) => {

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})