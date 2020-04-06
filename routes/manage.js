var db = require("../lib/db");
var express = require("express");
var router = express.Router();
var path = require("path");
var template = require("../lib/template.js");
var url = require("url");

////////////////////////////////////////////메인
router.get("/", function (request, response) {
  db.query(`SELECT id, title, content, category_id FROM post order by id desc limit 4`, function (
    error,
    post
  ) {
    if (error) {
      throw error;
    }
    var recentPost = ``;
    for (var i = 0; i < post.length; i++) {
      var content = post[i].content.replace(/(<([^>]+)>)/gi, "");
      content = content.replace(/&nbsp;/g, " ").substring(0, 400);
      recentPost += `
        <li>
            <a href="/category/${post[i].category_id}/post/${post[i].id}">
                <strong>${post[i].title}</strong>
                <p>${content}</p>
            </a>
        </li>
        `;
    }
    db.query(
      `SELECT comments.id, name, comment, post_id, date_format(comments.created, '%Y-%m-%d %H:%i:%s') as created, post.title, post.category_id FROM comments LEFT JOIN post ON comments.post_id = post.id order by comments.id desc limit 5`,
      function (error, comments) {
        if (error) {
          throw error;
        }
        var recentComments = template.manage_comments_List(comments);
        var inner = `
      <h3>최근 글</h3>
      <ul class="main_ul_recent_post">
      ${recentPost}
      </ul>
      <h3>최근 댓글</h3>
      <div class="manage_comments_inner">${recentComments}</div>
    `;
        var html = template.manage(inner);
        response.send(html);
      }
    );
  });
});

////////////////////////////////////////////카테고리
router.get("/category", function (request, response) {
  db.query(`SELECT * FROM category`, function (error, category) {
    if (error) {
      throw error;
    }
    var list = template.manage_category_list(category);
    var inner = `
    <h3>카테고리 관리</h3>
    <div class="manage_category_inner">
      <div class="all_item">
        <img src="/static/images/category.png" alt="카테고리" />
        <span class="tx_name">전체 카테고리</span>
      </div>
      <div id="field">${list}</div>
    </div>
    <div class="category_add">
      <input
        type="button"
        class="bt_category_add"
        value="+"
      />
    </div>
    <script src="/static/javascript/category.js"></script>
    `;
    var html = template.manage(inner);
    response.send(html);
  });
});

router.post("/category/create_process", function (request, response) {
  var post = request.body;
  var name = post.name;
  db.query(
    `
      INSERT INTO category(name) VALUES(?)`,
    [name],
    function (error) {
      if (error) {
        throw error;
      }
      response.redirect(`/manage/category`);
    }
  );
});

router.post("/category/update_process", function (request, response) {
  var post = request.body;
  var id = post.id;
  var name = post.name;
  db.query(
    `
      UPDATE category SET name=? WHERE id=?`,
    [name, id],
    function (error) {
      if (error) {
        throw error;
      }
      response.redirect(`/manage/category`);
    }
  );
});

router.post("/category/delete_process", function (request, response) {
  var post = request.body;
  var id = post.id;
  db.query(`DELETE FROM category WHERE id =?`, [id], function (error) {
    if (error) {
      throw error;
    }
  });
  db.query(`SELECT id from post WHERE category_id =?`, [id], function (error2, post) {
    if (error2) {
      throw error2;
    }
    for (var i = 0; i < post.length; i++) {
      db.query(`DELETE FROM comments WHERE post_id =?`, [post[i].id], function (error) {
        if (error) {
          throw error;
        }
      });
    }
  });
  db.query(`DELETE FROM post WHERE category_id=?`, [id], function (error3) {
    if (error3) {
      throw error3;
    }
    response.redirect(`/manage/category`);
  });
});

////////////////////////////////////////////포스트
router.get("/post/page/:pageId", function (request, response) {
  var id = path.parse(request.params.pageId).base;
  var offset = 10 * (id - 1);
  db.query(
    `SELECT post.id, category_id, title, name, date_format(created, '%Y-%m-%d %H:%i:%s') as created from post LEFT JOIN category ON category_id = category.id order by post.id DESC LIMIT 10 OFFSET ${offset}`,
    function (error, recent) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM category`, function (error2, category) {
        if (error2) {
          throw error2;
        }
        db.query(`SELECT id FROM post`, function (error3, allPost) {
          if (error3) {
            throw error3;
          }
          var recentPost = ``;
          if (recent.length == 0) {
            recentPost += `<p style="margin-left:10px; color:gray;font-size:20px">글을 등록하면 수정, 삭제를 할 수 있습니다.</p>`;
          }
          for (var i = 0; i < recent.length; i++) {
            recentPost += `<li class="li_recent_post">
            <div class="post_cont">
              <strong class="str_title">
                <a href="/category/${recent[i].category_id}/post/${recent[i].id}" title="${recent[i].title}" class="a_title">${recent[i].title}</a>
              </strong>
              <span class="sp_category">
                ${recent[i].name}
              </span>
              <span class="sp_created">
                ${recent[i].created}
              </span>
            </div>
            <div class="post_btn"> 
              <button class='bt_post_modify'><a href="/manage/post/update/${recent[i].id}" >수정</a></button> 
              <form action="/manage/post/delete_process" method="post">
                <input type="hidden" name="id" class= "hidden" value="${recent[i].id}">
                <input type='submit' class='bt_post_delete' value='삭제'>
            </form> 
            </div>
          </li>`;
          }
          var list = ``;
          for (var i = 0; i < category.length; i++) {
            list += `<li><a href="/manage/post/category/${category[i].id}/page/1">${category[i].name}</a></li>`;
          }
          var paging = ``;
          for (var i = 0; i < allPost.length / 10; i++) {
            if (id == i + 1) {
              paging += `<a href="/manage/post/page/${i + 1}" style="color : black">${i + 1}</a>`;
            } else {
              paging += `<a href="/manage/post/page/${i + 1}">${i + 1}</a>`;
            }
          }
          var inner = `
        <h3>글 관리</h3>
        <div class="manage_post_search">
          <div class="manage_post_spn">
            <span>전체 글</span><span> (${allPost.length})</span>
          </div>
          <div class="manage_post_btn">
            <button class="manage_post_btn_see">보기</button>
            <button class="manage_post_btn_search">검색</button>
            <div class="manage_post_see">
              <a href="/manage/post" class="all_post">전체 글 보기</a>
              <strong class="str_opt">카테고리별 보기</strong>
              <ul>${list}</ul>
            </div>
          </div>
        </div> 
        <div class="manage_post_inner">
          <ul class="ul_recent_post">
            ${recentPost}
          </ul>
        </div>
        <div class="manage_post_paging">${paging}</div>
        <script src="/static/javascript/post.js"></script>
        `;
          var html = template.manage(inner);
          response.send(html);
        });
      });
    }
  );
});

router.get("/post/category/:pageId/page/:pageId2", function (request, response) {
  var id = path.parse(request.params.pageId).base;
  var id2 = path.parse(request.params.pageId2).base;
  var offset = 10 * (id2 - 1);
  db.query(
    `SELECT post.id, title, name, date_format(created, '%Y-%m-%d %H:%i:%s') as created from post LEFT JOIN category ON category_id = category.id WHERE category.id=? order by post.id DESC  LIMIT 10 OFFSET ${offset}`,
    [id],
    function (error, recent) {
      if (error) {
        throw error;
      }
      db.query(`SELECT * FROM category`, function (error2, category) {
        if (error2) {
          throw error2;
        }
        db.query(`SELECT id FROM post WHERE category_id=?`, [id], function (error3, allPost) {
          if (error3) {
            throw error3;
          }
          var recentPost = ``;
          for (var i = 0; i < recent.length; i++) {
            recentPost += `<li class="li_recent_post">
            <div class="post_cont">
              <strong class="str_title">
                <a href="/category/${id}/post/${recent[i].id}" title="${recent[i].title}" class="a_title">${recent[i].title}</a>
              </strong>
              <span class="sp_category">
                ${recent[i].name}
              </span>
              <span class="sp_created">
                ${recent[i].created}
              </span>
            </div>
            <div class="post_btn"> 
              <button class='bt_post_modify'><a href="/manage/post/update/${recent[i].id}" >수정</a></button> 
              <form action="/manage/post/delete_process" method="post">
                <input type="hidden" name="id" class= "hidden" value="${recent[i].id}">
                <input type='submit' class='bt_post_delete' value='삭제'>
            </form>
            </div>
          </li>`;
          }
          var categoryTitle;
          var list = ``;
          for (var i = 0; i < category.length; i++) {
            list += `<li><a href="/manage/post/category/${category[i].id}/page/1">${category[i].name}</a></li>`;
            if (category[i].id == id) {
              categoryTitle = category[i].name;
            }
          }
          var paging = ``;
          for (var i = 0; i < allPost.length / 10; i++) {
            if (id2 == i + 1) {
              paging += `<a href="/manage/post/category/${id}/page/${
                i + 1
              }" style="color : black">${i + 1}</a>`;
            } else {
              paging += `<a href="/manage/post/category/${id}/page/${i + 1}">${i + 1}</a>`;
            }
          }
          var inner = `
        <h3>글 관리</h3>
        <div class="manage_post_search">
          <div class="manage_post_spn">
            <span>${categoryTitle}</span><span> (${allPost.length})</span>
          </div>
          <div class="manage_post_btn">
            <button class="manage_post_btn_see">보기</button>
            <button class="manage_post_btn_search">검색</button>
            <div class="manage_post_see">
              <a href="/manage/post" class="all_post">전체 글 보기</a>
              <strong class="str_opt">카테고리별 보기</strong>
              <ul>${list}</ul>
            </div>
          </div>
        </div> 
        <div class="manage_post_inner">
          <ul class="ul_recent_post">
            ${recentPost}
          </ul>
        </div>
        <div class="manage_post_paging">${paging}</div>
        <script src="/static/javascript/post.js"></script>
        `;
          var html = template.manage(inner);
          response.send(html);
        });
      });
    }
  );
});

router.get("/post/create", function (request, response) {
  db.query(`SELECT * FROM category`, function (error, category) {
    if (error) {
      throw error;
    }
    var form = `<form action="create_process" method="post">`;
    var list = template.categorySelect(category);
    var html = template.manage_writing(form, ``, ``, list, ``);
    response.send(html);
  });
});

router.post("/post/create_process", function (request, response) {
  var post = request.body;
  var title = post.title;
  var content = post.ir1;
  var category_id = post.category;
  db.query(
    `
      INSERT INTO post(title, content, category_id) VALUES(?,?,?)`,
    [title, content, category_id],
    function (error) {
      if (error) {
        throw error;
      }
      response.redirect(`/manage/post/page/1`);
    }
  );
});

router.get("/post/update/:pageId", function (request, response) {
  var id = path.parse(request.params.pageId).base;
  db.query(`SELECT * FROM post WHERE id=?`, [id], function (error, post) {
    if (error) {
      throw error;
    }
    db.query(`SELECT * FROM category`, function (error2, category) {
      if (error2) {
        throw error2;
      }
      var form = `<form action="../update_process" method="post">`;
      var title = post[0].title;
      var content = post[0].content;
      var list = template.categorySelect(category, post[0].category_id);
      var html = template.manage_writing(form, id, title, list, content);
      response.send(html);
    });
  });
});

router.post("/post/update_process", function (request, response) {
  var post = request.body;
  var title = post.title;
  var id = post.id;
  var content = post.ir1;
  var category_id = post.category;

  db.query(
    `
      UPDATE post SET title=?, content=?, category_id=? WHERE id=?`,
    [title, content, category_id, id],
    function (error) {
      if (error) {
        throw error;
      }
      response.redirect(`/manage/post/page/1`);
    }
  );
});

router.post("/post/delete_process", function (request, response) {
  var post = request.body;
  var id = post.id;
  db.query(`DELETE FROM comments WHERE post_id =?`, [id], function (error) {
    if (error) {
      throw error;
    }
  });
  db.query(`DELETE FROM post WHERE id =?`, [id], function (error) {
    if (error) {
      throw error;
    }
    response.redirect(`/manage/post/page/1`);
  });
});

////////////////////////////////////////////댓글
router.get("/comments/page/:pageId", function (request, response) {
  var id = path.parse(request.params.pageId).base;
  var offset = 10 * (id - 1);
  var _url = request.url;
  var queryData = url.parse(_url);
  db.query(
    `SELECT comments.id, name, comment, post_id, date_format(comments.created, '%Y-%m-%d %H:%i:%s') as created, post.title, post.category_id FROM comments LEFT JOIN post ON comments.post_id = post.id order by comments.id desc LIMIT 10 OFFSET ${offset}`,
    function (error, comments) {
      if (error) {
        throw error;
      }
      db.query(`SELECT id FROM post`, function (error2, allComments) {
        if (error2) {
          throw error2;
        }
        var list = template.manage_comments_List(comments, queryData.href);
        var paging = ``;
        for (var i = 0; i < allComments.length / 10; i++) {
          if (id == i + 1) {
            paging += `<a href="/manage/comments/page/${i + 1}" style="color : black">${i + 1}</a>`;
          } else {
            paging += `<a href="/manage/comments/page/${i + 1}">${i + 1}</a>`;
          }
        }
        var inner = `
          <h3>댓글 관리</h3>
          <div class="manage_comments_inner">${list}</div>
          <div class="manage_post_paging">${paging}</div>
          `;
        var html = template.manage(inner);
        response.send(html);
      });
    }
  );
});

router.post("/comments/delete_process", function (request, response) {
  var post = request.body;
  var id = post.id;
  db.query(
    `
      DELETE FROM comments WHERE id =?`,
    [id],
    function (error) {
      if (error) {
        throw error;
      }
      response.redirect(`/manage/${post.href}`);
    }
  );
});
module.exports = router;
