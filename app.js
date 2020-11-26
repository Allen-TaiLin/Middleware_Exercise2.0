// app.js
const express = require('express')
const exphbs = require('express-handlebars')
const morgan = require('morgan')
const app = express()
const port = 3000

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 自定義時間格式 (token)
// 開始
morgan.token('startTime', function getDate(req, res) {
  return req.requestTime
})

// 結束
morgan.token('endTime', function getDate(req, res) {
  return res.responseTime
})

// 換算
morgan.token('spend', function getDate(req, res) {
  return (Date.parse(res.responseTime) - Date.parse(req.requestTime)) / 1000  //換算成秒
})

// 自訂收到請求時間
const requestTime = function (req, res, next) {
  req.requestTime = new Date().toLocaleString()
  // 延遲測試
  setTimeout(function () {
    next()
  }, 3000)
}

// 自訂送出回應時間
const responseTime = function (req, res, next) {
  res.responseTime = new Date().toLocaleString()
  next();
};

// 輸出紀錄
function timeRecord(req, res) {
  let responseText = '\n'

  responseText += `Requested at: ${req.requestTime} | Responded at:  ${res.responseTime} || total time: ${Date.parse(res.responseTime) - Date.parse(req.requestTime)} ms(毫秒)`

  responseText += '\n-----------------------------'
  return responseText
}

// 定義format
morgan.format('messageLog', '[ Requested at: :startTime ~ Responded at: :endTime ] | :method from :url | total time: :response-time ms(毫秒) || :spend s(秒)')
// 使用自定義的format
app.use(morgan('messageLog'))
app.use(requestTime)
app.use(responseTime)


// routes setting
app.get('/', (req, res) => {
  const message = '列出全部 Todo'
  //console.log(timeRecord(req, res))
  res.render('index', { message })
})

app.get('/new', (req, res) => {
  const message = '新增 Todo 頁面'
  res.render('new', { message })
})

app.get('/:id', (req, res) => {
  const message = '顯示一筆 Todo'
  res.render('detail', { message })
})

app.post('/', (req, res) => {
  const message = '新增一筆  Todo 成功'
  res.render('detail', { message })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`App running on port ${port}`)
})