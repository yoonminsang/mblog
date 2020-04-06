var db = require("../lib/db");
var express = require("express");
var router = express.Router();
var template = require("../lib/template.js");
router.get("/", function (request, response) {
  db.query(`SELECT * FROM category`, function (error, category) {
    if (error) {
      throw error;
    }
    db.query(`SELECT category_id FROM post`, function (error2, post) {
      if (error2) {
        throw error2;
      }
      var list = template.categoryList(category, post);
      var title = "Main";
      var title2 = "여러가지 요리 레시피를 올리는 블로그입니다.";
      var inner = `
        <div class="inner_main_img">
          <img src="/static/images/Soybean Paste Stew.jpg" alt="된장찌개" />
          <img src="/static/images/Pork Belly.jpg" alt="삼겹살" />
          <img src="/static/images/jajangmyeon.jpg" alt="짜장면" />
          <img src="/static/images/sushi.jpg" alt="초밥" />
          <img src="/static/images/pasta.jpg" alt="파스타" />
          <img src="/static/images/steak.jpg" alt="스테이크" />
        </div>
        `;
      var html = template.HTML(title, title2, inner, list, ``);
      response.send(html);
    });
  });
});

module.exports = router;
