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

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요!!")
})

const request = require('request');
const convert = require('xml-js');
const url = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev';

let queryParams = '?' + encodeURIComponent('ServiceKey') + '=bnBEGVuwtT5NKo0egMDg6k%2FWfO3cZecOEIZATTr0dTRRpi029EspW9zP6rSctze7j669Uc59LDlU%2BDpvgwNBqw%3D%3D'; /* Service Key*/
//queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
//queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
//queryParams += '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent('11110'); /* */
//queryParams += '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent('201512'); /* */

console.log(url + queryParams);

app.post('/api/apt', (req, res) => {
  console.log(req.body);
  let LAWD_CD = req.body.myDong;
  let DEAL_YMD = req.body.myDate;
  let pageNo = req.body.myPage;
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + pageNo +'&' + encodeURIComponent('numOfRows') + '=10' +
  '&' + encodeURIComponent('LAWD_CD') + '=' + LAWD_CD + '&' + encodeURIComponent('DEAL_YMD') + '=' + DEAL_YMD;
  request.get(url + queryParams, (err, response, body) => {
    if (err) {
      console.log(`err => ${err}`);
    }
    else {
      if (response.statusCode == 200) {
        const xml = body;
        // console.log(`body data => ${result}`);
        const result = convert.xml2json(xml, { 
          compact: true, 
          spaces: 4 
        });
        const jsonData = JSON.parse(result);
        // console.log(xmlToJson.response.body.items.item[0]);
        res.send(jsonData.response.body.items);
      }
    }
  });

});


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