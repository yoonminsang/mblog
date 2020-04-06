var express = require("express");
var app = express();
var port = 80;
var bodyParser = require("body-parser");
var compression = require("compression");
var helmet = require("helmet");
var indexRouter = require("./routes/index");
var searchRouter = require("./routes/search");
var manageRouter = require("./routes/manage");
var categoryRouter = require("./routes/category");

// app.use(express.static("public")); //정적파일사용(폴더 불러오기)
// app.use(express.static(__dirname + "/public"));
app.use("/static", express.static(__dirname + "/public"));
app.use(helmet()); //보안
app.use(bodyParser.urlencoded({ extended: false })); //post 방식으로 전송된 form 데이터를 쉽게 가져오는 방법
app.use(compression()); //컨텐츠를 압축해서 전송하는 방법

app.use("/", indexRouter);
app.use("/search", searchRouter);
app.use("/manage", manageRouter);
app.use("/category", categoryRouter);

app.use(function(req, res, next) {
  res.status(404).send("Sorry cant find that!");
}); //404 파일 없을때

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
}); //500 오류

app.listen(port, () => console.log(`port ${port}!`));
