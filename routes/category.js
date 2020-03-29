var db = require("../lib/db");
var express = require("express");
var router = express.Router();
var path = require("path");
var template = require("../lib/template.js");

router.get("/all/page/:pageId", function(request, response) {
  var id = path.parse(request.params.pageId).base;
  var offset = 2 * (id - 1);
  db.query(
    `SELECT id, title, content, category_id, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post order by post.id DESC LIMIT 2 OFFSET ${offset}`,
    function(error, post) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM category`, function(error2, category) {
        if (error2) {
          throw error2;
        }
        db.query(`SELECT category_id FROM post`, function(error3, post2) {
          if (error3) {
            throw error3;
          }
          var list = template.categoryList(category, post2);
          var title = "전체 글";
          var title2 = `<span><h2>전체 글</h2></span><span style="padding-left : 5px; font-weight : bold">(${post2.length})</span>`;
          var inner = template.allPostList(post);
          var pagination = ``;
          for (var i = 0; i < post2.length / 2; i++) {
            if (id == i + 1) {
              pagination += `<a href="/category/all/page/${i +
                1}" style="color : black">${i + 1}</a>`;
            } else {
              pagination += `<a href="/category/all/page/${i + 1}">${i +
                1}</a>`;
            }
          }

          var html = template.HTML(title, title2, inner, list, pagination);
          response.send(html);
        });
      });
    }
  );
});

router.get("/:pageId2/page/:pageId", function(request, response) {
  db.query(`SELECT category_id FROM post`, function(error, post) {
    if (error) {
      throw error;
    }
    var id2 = path.parse(request.params.pageId2).base;
    var id = path.parse(request.params.pageId).base;
    var offset = 2 * (id - 1);
    db.query(
      `SELECT id, title, content, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post WHERE category_id=? order by post.id DESC LIMIT 2 OFFSET ${offset}`,
      [id2],
      function(error2, post2) {
        if (error2) {
          throw error2;
        }
        db.query(`SELECT * FROM category`, function(error3, category) {
          if (error3) {
            throw error3;
          }
          db.query(`SELECT id FROM post WHERE category_id=?`, [id2], function(
            error4,
            post3
          ) {
            if (error4) {
              throw error4;
            }
            var name;
            for (var i = 0; i < category.length; i++) {
              if (id2 == category[i].id) {
                name = category[i].name;
              }
            }
            var list = template.categoryList(category, post);
            var title = name;
            var title2 = `<span><h2>${name}</h2></span><span style="padding-left : 5px; font-weight : bold">(${post3.length})</span>`;
            var inner = template.postList(post2);
            var pagination = ``;
            for (var i = 0; i < post3.length / 2; i++) {
              if (id == i + 1) {
                pagination += `<a href="/category/${id2}/page/${i +
                  1}" style="color : black">${i + 1}</a>`;
              } else {
                pagination += `<a href="/category/${id2}/page/${i + 1}">${i +
                  1}</a>`;
              }
            }
            var html = template.HTML(title, title2, inner, list, pagination);
            response.send(html);
          });
        });
      }
    );
  });
});

router.get("/:pageId2/post/:pageId", function(request, response) {
  db.query(`SELECT category_id FROM post`, function(error, post) {
    if (error) {
      throw error;
    }
    var id2 = path.parse(request.params.pageId2).base;
    var id = path.parse(request.params.pageId).base;
    db.query(
      `SELECT id, title, content, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post WHERE id=?`,
      [id],
      function(error, post2) {
        if (error) {
          throw error;
        }
        db.query(`SELECT * FROM category`, function(error2, category) {
          if (error2) {
            throw error2;
          }
          var name = category[id2 - 1].name;
          var list = template.categoryList(category, post);
          var title = post2[0].title;
          var title2 = `
            <div style="display : inline-block; color : #808080; border-bottom : 1px solid #a3a3a3;">${name}</div>
            <h1>${post2[0].title}</h1>
            <span style="color : #808080">${post2[0].created}</span>
            `;
          var inner = `${post2[0].content}`;
          var pagination = ``;
          var html = template.HTML(title, title2, inner, list, pagination);
          response.send(html);
        });
      }
    );
  });
});

module.exports = router;
