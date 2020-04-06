var db = require("../lib/db");
var express = require("express");
var router = express.Router();
var path = require("path");
var template = require("../lib/template.js");
var url = require("url");

router.get("/all/page/:pageId", function (request, response) {
  var id = path.parse(request.params.pageId).base;
  var offset = 5 * (id - 1);
  db.query(
    `SELECT id, title, content, category_id, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post order by post.id DESC LIMIT 5 OFFSET ${offset}`,
    function (error, post) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM category`, function (error2, category) {
        if (error2) {
          throw error2;
        }
        db.query(`SELECT category_id FROM post`, function (error3, post2) {
          if (error3) {
            throw error3;
          }
          var list = template.categoryList(category, post2);
          var title = "전체 글";
          var title2 = `<span><h2>전체 글</h2></span><span style="padding-left : 5px; font-weight : bold">(${post2.length})</span>`;
          var inner = template.allPostList(post);
          var pagination = `<div class="pagination">`;
          for (var i = 0; i < post2.length / 5; i++) {
            if (id == i + 1) {
              pagination += `<a href="/category/all/page/${i + 1}" style="color : black">${
                i + 1
              }</a>`;
            } else {
              pagination += `<a href="/category/all/page/${i + 1}">${i + 1}</a>`;
            }
          }
          pagination += `</div>`;

          var html = template.HTML(title, title2, inner, list, pagination);
          response.send(html);
        });
      });
    }
  );
});

router.get("/:pageId2/page/:pageId", function (request, response) {
  db.query(`SELECT category_id FROM post`, function (error, post) {
    if (error) {
      throw error;
    }
    var id2 = path.parse(request.params.pageId2).base;
    var id = path.parse(request.params.pageId).base;
    var offset = 5 * (id - 1);
    db.query(
      `SELECT id, title, content, category_id, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post WHERE category_id=? order by post.id DESC LIMIT 5 OFFSET ${offset}`,
      [id2],
      function (error2, post2) {
        if (error2) {
          throw error2;
        }
        db.query(`SELECT * FROM category`, function (error3, category) {
          if (error3) {
            throw error3;
          }
          db.query(`SELECT id FROM post WHERE category_id=?`, [id2], function (error4, post3) {
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
            var inner = template.allPostList(post2);
            var pagination = `<div class="pagination">`;
            for (var i = 0; i < post3.length / 5; i++) {
              if (id == i + 1) {
                pagination += `<a href="/category/${id2}/page/${i + 1}" style="color : black">${
                  i + 1
                }</a>`;
              } else {
                pagination += `<a href="/category/${id2}/page/${i + 1}">${i + 1}</a>`;
              }
            }
            pagination += `</div>`;
            var html = template.HTML(title, title2, inner, list, pagination);
            response.send(html);
          });
        });
      }
    );
  });
});

router.get("/:pageId2/post/:pageId", function (request, response) {
  db.query(`SELECT category_id FROM post`, function (error, post) {
    if (error) {
      throw error;
    }
    var id2 = path.parse(request.params.pageId2).base;
    var id = path.parse(request.params.pageId).base;
    db.query(
      `SELECT id, title, content, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post WHERE id=?`,
      [id],
      function (error, post2) {
        if (error) {
          throw error;
        }
        db.query(`SELECT * FROM category`, function (error2, category) {
          if (error2) {
            throw error2;
          }
          db.query(
            `SELECT id, name, password, comment, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM comments WHERE post_id=?`,
            [id],
            function (error3, comments) {
              if (error3) {
                throw error3;
              }
              db.query(`SELECT id FROM post where category_id=? order by id desc`, [id2], function (
                error5,
                allPost
              ) {
                if (error5) {
                  throw error5;
                }
                var num;
                for (var i = 0; i < allPost.length; i++) {
                  if (id == allPost[i].id) {
                    num = i;
                    break;
                  }
                }
                // num = parseInt(num / 5) * 5;
                console.log(num);
                console.log(allPost.length);
                if (allPost.length > 4) {
                  if (num == 0);
                  else if (num == 1) {
                    num = 0;
                  } else if (num < allPost.length - 2) {
                    num = num - 2;
                  } else if (num == allPost.length - 2) {
                    num = num - 3;
                  } else {
                    num = num - 4;
                  }
                } else {
                  num = 0;
                }
                db.query(
                  `SELECT id, title, date_format(created, '%Y-%m-%d %H:%i:%s') as created FROM post WHERE category_id=? order by id desc limit ${num}, 5  `,
                  [id2],
                  function (error4, paginationPost) {
                    if (error4) {
                      throw error4;
                    }
                    var name;
                    for (var i = 0; i < category.length; i++) {
                      if (id2 == category[i].id) {
                        name = category[i].name;
                      }
                    }
                    var _url = request.url;
                    var queryData = url.parse(_url);
                    var comment_list = template.commentList(comments, queryData.href);
                    var list = template.categoryList(category, post);
                    var title = post2[0].title;
                    var title2 = `
                  <div style="display : inline-block; color : #808080; border-bottom : 1px solid #a3a3a3;">${name}</div>
                  <h1>${post2[0].title}</h1>
                  <span style="color : #808080">${post2[0].created}</span>
                  `;
                    var inner = `
                  ${post2[0].content}
                  ${comment_list}
                  <div class="comment">
                    <form action="/category/comments/create_process" method="post">
                        <input type="hidden" name="href" class="hide" value="${queryData.href}">
                        <input type="hidden" name="post_id" class="hide" value="${id}">
                        <div class="comment_user">
                            <div class="user_info_input">
                                <input type="text" name="name" placeholder="닉네임" maxlength="20">
                            </div>
                            <div class="user_info_input">
                                <input type="password" name="password" placeholder="비밀번호" maxlength="20">
                            </div>   
                        </div>
                        <div class="comment_cont">
                            <div class="comment_write">
                                <textarea name="comment" maxlength="400"></textarea>
                            </div>
                            <div class="comment_bt">
                                <button type="submit">저장</button>
                            </div>
                        </div>
                    </form>
                  </div>
                  <script src="/static/javascript/comment.js"></script>
                  `;
                    var pagination = template.pagination(paginationPost, name, id);
                    var html = template.HTML(title, title2, inner, list, pagination);
                    response.send(html);
                  }
                );
              });
            }
          );
        });
      }
    );
  });
});

router.post("/comments/create_process", function (request, response) {
  var post = request.body;
  db.query(
    `
    INSERT INTO comments(name, password, comment,  post_id) VALUES(?, ?, ?, ?)`,
    [post.name, post.password, post.comment, post.post_id],
    function (error) {
      if (error) {
        throw error;
      }
      response.redirect(`/category${post.href}`);
    }
  );
});

router.post("/comments/delete_process", function (request, response) {
  var post = request.body;
  db.query(
    `
    DELETE FROM comments WHERE id =?;`,
    [post.id],
    function (error) {
      if (error) {
        throw error;
      }
      response.redirect(`/category${post.href}`);
    }
  );
});

module.exports = router;
