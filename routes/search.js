var db = require("../lib/db");
var express = require("express");
var router = express.Router();
var path = require("path");
var template = require("../lib/template.js");

router.get("/page/:pageId", function (request, response) {
  var id = "";
  var id2 = path.parse(request.params.pageId).base;
  db.query(
    `SELECT id, title, content, category_id, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post`,
    function (error, post) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM category`, function (error2, category) {
        if (error2) {
          throw error2;
        }
        var list = template.categoryList(category, post);
        for (var i = 0; i < post.length; i++) {
          if (post[i].title.includes(id) === false && post[i].content.includes(id) === false) {
            delete post[i];
          }
        }
        post = post.filter((value) => Object.keys(value).length !== 0);
        var offset = 5 * (id2 - 1);
        db.query(
          `SELECT id, title, content, category_id, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post order by id desc LIMIT 5 OFFSET ${offset}`,
          function (error3, post2) {
            if (error3) {
              throw error3;
            }
            var title = `'${id}'의 검색결과`;
            var title2 = `<span>${id}</h2></span><span style="padding-left : 5px; font-weight : bold">(${post.length})</span>`;
            var inner = template.allPostList(post2);
            var pagination = `<div class="pagination">`;
            for (var i = 0; i < post.length / 5; i++) {
              if (id2 == i + 1) {
                pagination += `<a href="/search/${id}/page/${i + 1}" style="color : black">${
                  i + 1
                }</a>`;
              } else {
                pagination += `<a href="/search/${id}/page/${i + 1}">${i + 1}</a>`;
              }
            }
            pagination += `</div>`;
            var html = template.HTML(title, title2, inner, list, pagination);
            response.send(html);
          }
        );
      });
    }
  );
});

router.get("/:pageId/page/:pageId2", function (request, response) {
  var id = path.parse(request.params.pageId).base;
  var id2 = path.parse(request.params.pageId2).base;
  var offset = 5 * (id2 - 1);
  db.query(
    `SELECT id, title, content, category_id, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post WHERE title LIKE '%${id}%' OR content LIKE'%${id}%' order by id DESC LIMIT 5 OFFSET ${offset}`,
    function (error, post) {
      if (error) {
        throw error;
      }
      db.query(
        `SELECT title,content FROM post WHERE title LIKE '%${id}%' OR content LIKE'%${id}%'`,
        function (error2, allPost) {
          if (error2) {
            throw error2;
          }
          db.query(`SELECT category_id FROM post`, function (error4, listPost) {
            if (error4) {
              throw error4;
            }
            db.query(`SELECT * FROM category`, function (error3, category) {
              if (error3) {
                throw error3;
              }
              var list = template.categoryList(category, listPost);
              var title = `'${id}'의 검색결과`;
              var title2 = `<span>${id}</h2></span><span style="padding-left : 5px; font-weight : bold">(${allPost.length})</span>`;
              var inner = template.allPostList(post);
              var pagination = `<div class="pagination">`;
              for (var i = 0; i < allPost.length / 5; i++) {
                console.log(i);
                if (id2 == i + 1) {
                  pagination += `<a href="/search/${id}/page/${i + 1}" style="color : black">${
                    i + 1
                  }</a>`;
                } else {
                  pagination += `<a href="/search/${id}/page/${i + 1}">${i + 1}</a>`;
                }
              }
              pagination += `</div>`;
              var html = template.HTML(title, title2, inner, list, pagination);
              response.send(html);
            });
          });
        }
      );
    }
  );
});

module.exports = router;
