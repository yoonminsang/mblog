module.exports = {
  HTML: function (title, title2, inner, list, pagination) {
    //여기 카테고리 넣기
    return `
    <!doctype html>
    <html>
    <head>
      <title>M's Food - ${title}</title>
      <meta charset="utf-8">
      <link rel="stylesheet" href="/static/stylesheets/style.css" type="text/css">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

      <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-152888961-2"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-152888961-2');
      </script>
    </head>
    <body class="body">
    <header>
      <h1><a href="/">M's food</a></h1>
      <button type="button" class="bt_menu">
        <img src="/static//images/menu.png" alt="메뉴" />
      </button>
      <div class="menu">
        <nav class="nav_menu">
          ${list}
        </nav>
        <p class="powered">Powered By MinSang</p>
      </div>
      <div class="search">
        <input type="text" name="search" placeholder="검색 내용을 입력하세요.">
        <button type="button" class="btn_search_off"><img src="/static/images/search.png" alt="검색"</img></button>
      </div>
    </header>
    <hr />
    <section>
      <div class="section_header">
        ${title2}
      </div>
      <div class="inner">
        ${inner}
      </div>
    </section>
    <hr />
    <aside></aside>
    ${pagination}
    <hr />
    <footer id="footer">
      <p class="copyright">
        DESIGN BY MINSANG
        <a href="/manage">| 관리자</a>
      </p>
    </footer>
    <hr />
    <script src="/static/javascript/menu.js"></script>
    </body>
    </html>
      `;
  },

  categoryList: function (category, post) {
    var list = `<ul id="menu_ul">`;
    list += `<li><a href="/category/${"all"}/page/1">${"전체글"}<span>(${
      post.length
    })</span></a></li>`;
    for (var i = 0; i < category.length; i++) {
      var num = 0;
      for (var j = 0; j < post.length; j++) {
        if (category[i].id == post[j].category_id) {
          num++;
        }
      }
      list += `<li><a href="/category/${category[i].id}/page/1">${category[i].name}<span>(${num})</span></a></li>`;
    }
    list += "</ul>";
    return list;
  },

  allPostList: function (post) {
    var list = ``;
    for (var i = 0; i < post.length; i++) {
      var content = post[i].content.replace(/(<([^>]+)>)/gi, "");
      content = content.replace(/&nbsp;/g, " ").substring(0, 400);
      list += `
      <div class="post-item">
        <a href="/category/${post[i].category_id}/post/${post[i].id}">
          <span class="img"></span>
          <span class="title">${post[i].title}</span>
          <span class="content">${content}</span>
          <span class="created">${post[i].created}</span>
        </a>
      </div>
        `;
    }
    return list;
  },

  commentList: function (comment, href) {
    if (comment.length != 0) {
      var list = `<p style="margin : 200px 0 10px">전체 댓글(${comment.length})</p><div class="comment_box">`;
      for (var i = 0; i < comment.length; i++) {
        list += `
      <li>
        <div class="comment_box_info">
            <div class="comment_box_nick">
                <span>${comment[i].name}</span>
            </div>
            <div class="comment_box_content">
                <p>${comment[i].comment}</p>
            </div>
            <div class="comment_box_time">
                <span>${comment[i].created}</span>
                <form action="/category/comments/delete_process" method="post">
                <input type="hidden" name="href" class="hide" value="${href}">
                <input type="hidden" name="id" class="hide" value="${comment[i].id}">
                <div class="comment_box_del">
                    <button type="button" class="btn_delete">x</button>
                </div>
                </form>
            </div>
        </div>
      </li>
      `;
      }
      list += `</div>`;
      return list;
    } else {
      var list = ``;
      return list;
    }
  },

  pagination: function (post, name, id) {
    var list = `
    <div class="post_pagination">
      <h4><span style="font-size: 14px">'${name}'</span> 카테고리의 다른 글</h4>
      <table>
        <tbody>`;
    for (var i = 0; i < post.length; i++) {
      if (id != post[i].id) {
        list += `
      <tr>
        <th>
          <a href="${post[i].id}">${post[i].title}</a>
        </th>
        <td>
          ${post[i].created}
        </td>
      </tr>
      `;
      } else {
        list += `
        <tr>
          <th>
            <a href="${post[i].id}" class="current">${post[i].title}</a>
          </th>
          <td>
            ${post[i].created}
          </td>
        </tr>
        `;
      }
    }
    list += `  
        </tbody>
      </table>
    </div>
    `;
    return list;
  },

  manage: function (inner) {
    return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>manage</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <link rel="stylesheet" href="/static/stylesheets/manage_style.css" />
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-152888961-2"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
  
          gtag('config', 'UA-152888961-2');
        </script>
      </head>
      <body>
        <header>
          <h1>
            <a href="/manage">관리자 페이지</a>
          </h1>
          <a href="/manage/post/create" class="create">글쓰기</a>
          <a href="/" class="home"><img src="/static/images/home.png" alt="홈"
          /></a>
        </header>
        <hr />
        <aside>
          <div id="manage_menu">
            <strong>
              <img src="/static/images/contents.png" alt="콘텐츠" />
              <span>콘텐츠</span></strong
            >
            <ul class="manage_menu_ul">
              <li class="manage_menu_li"><a href="/manage/post/page/1">글 관리</a></li>
              <li class="manage_menu_li"><a href="/manage/category">카테고리 관리</a></li>
            </ul>
            <strong><img src="/static/images/comment.png" alt="댓글" />
              <span>댓글</span>
            </strong>
            <ul class="manage_menu_ul">
              <li class="manage_menu_li"><a href="/manage/comments/page/1">댓글 관리</a></li>
            </ul>
            <strong>
              <img src="/static/images/statics.png" alt="통계" />
              <span>통계</span>
            </strong>
            <ul class="manage_menu_ul">
              <li class="manage_menu_li"><a href="https://analytics.google.com/analytics/web/?pli=1#/realtime/rt-overview/a152888961w228091004p215172025/" target="_blanck">방문 통계</a></li>
              <li class="manage_menu_li"><a href="https://analytics.google.com/analytics/web/?pli=1#/report/visitors-overview/a152888961w228091004p215172025/" target="_blanck">유입 경로</a></li>
            </ul>
          </div>
        </aside>
        <hr />
        <section>
          <div class="manage_article">
            ${inner}
          </div>
        </section>
        <hr />
        <footer>
        </footer>
        <hr />
      </body>
    </html>
    `;
  },
  manage_list: function () {},
  manage_category_list: function (category) {
    var list = ``;
    if (category.length == 0) {
      list += `<p style="margin: 0 0 10px 10px; color:gray;font-size:20px">아래 +버튼으로 카테고리를 만들 수 있습니다.</p>`;
    }
    for (var i = 0; i < category.length; i++) {
      list += `
      <div class="bundle_item" id="${i + 1}">
        <img src='/static/images/category.png' alt='카테고리' />
        <span class='tx_name'>${category[i].name}</span>
        <form action="/manage/category/delete_process" method="post">
          <input type="hidden" name="id" class= "hidden" value="${category[i].id}">
          <input type='submit' class='bt_category_delete' value='삭제'></input>
        </form>
        <input type='button' class='bt_category_modify' value='수정'></input> 
      </div>`;
    }
    return list;
  },
  manage_writing: function (form, id, title, list, content) {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>네이버 :: Smart Editor 2 &#8482;</title>
        <style>
          select{
            width : 190px;
            height : 58px;
            font-size : 18px;
            padding : 5px;
            border : 1px solid lightgray;
            border-radius : 10px;
            outline : none;
            position : relative;
            bottom : 3px
          }
          form{
            padding : 0 250px;
          }
        </style>
        <script
          type="text/javascript"
          src="/static/editor/js/service/HuskyEZCreator.js"
          charset="utf-8">
        </script>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-152888961-2"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
  
          gtag('config', 'UA-152888961-2');
        </script>
      </head>
      <body>
        ${form}
          <p style="text-align:center">
            <input type="hidden" name="id" value="${id}">
            <input type="text" name="title" placeholder="제목" value="${title}" 
            style="width:780px; padding : 10px; border: 1px solid lightgray; outline:none; border-radius : 10px; font-size:32px; display: inline-block">
            ${list}
          </p>
          
          <textarea
            name="ir1"
            id="ir1"
            rows="10"
            cols="100"
            style="width:100%; height:550px; min-width:300px; display:none; ">
          </textarea>
          <p>
            <input
              type="button"
              onclick="submitContents(this);"
              value="저장"
            />
            <input type="button" value="취소" onclick="history.back(-1);">
            <input type="button" onclick="pasteHTML();" value="본문에 내용 넣기" />
            <input type="button" onclick="showHTML();" value="본문 내용 가져오기" />
          </p>
        </form>
        <script>
        history.pushState(null, null, '');  //data, title, url 의 값이 들어가게 됩니다. 비워두면 이벤트 발생의 플래그 정도로 사용 할 수 있습니다.
        //기존페이지 이외에 입력한 URL로 페이지가 하나 더 만들어지는 것을 알 수 있습니다.
        window.onpopstate = function(event) {  //뒤로가기 이벤트를 캐치합니다.
        // history.back();   // pushState로 인하여 페이지가 하나 더 생성되기 떄문에 한번에 뒤로가기 위해서 뒤로가기를 한번 더 해줍니다.
        if (confirm("페이지를 나가시겠습니까? 내용은 저장되지 않습니다.") == true){    //확인
          history.back();
        }else{   //취소
          return false;
        }
        };
        </script>
        <script type="text/javascript">
          var oEditors = [];
          var sLang = "ko_KR"; // 언어 (ko_KR/ en_US/ ja_JP/ zh_CN/ zh_TW), default = ko_KR

          // 추가 글꼴 목록
          //var aAdditionalFontSet = [["MS UI Gothic", "MS UI Gothic"], ["Comic Sans MS", "Comic Sans MS"],["TEST","TEST"]];

          nhn.husky.EZCreator.createInIFrame({
            oAppRef: oEditors,
            elPlaceHolder: "ir1",
            sSkinURI: "/static/editor/SmartEditor2Skin.html",
            htParams: {
              bUseToolbar: true, // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
              bUseVerticalResizer: true, // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
              bUseModeChanger: true, // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
              //bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
              //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
              fOnBeforeUnload: function() {
                //alert("완료!");
              },
              I18N_LOCALE: sLang
            }, //boolean
            fOnAppLoad: function() {
              oEditors.getById["ir1"].exec("PASTE_HTML", ["${content}"]);
            },
            fCreator: "createSEditor2"
          });

          function pasteHTML() {
            var sHTML = "<span style='color:#FF0000;'>이미지도 같은 방식으로 삽입합니다.<\/span>";
            oEditors.getById["ir1"].exec("PASTE_HTML", [sHTML]);
          }
          
          function showHTML() {
            var sHTML = oEditors.getById["ir1"].getIR();
            alert(sHTML);
          }

          function submitContents(elClickedObj) {
            oEditors.getById["ir1"].exec("UPDATE_CONTENTS_FIELD", []); // 에디터의 내용이 textarea에 적용됩니다.

            // 에디터의 내용에 대한 값 검증은 이곳에서 document.getElementById("ir1").value를 이용해서 처리하면 됩니다.

            try {
              elClickedObj.form.submit();
            } catch (e) {}
          }
        </script>
      </body>
    </html>

    `;
  },
  categorySelect: function (categorys, category_id) {
    var tag = "";
    for (var i = 0; i < categorys.length; i++) {
      var selected = "";
      if (categorys[i].id == category_id) {
        selected = "selected";
      }
      tag += `<option value="${categorys[i].id}"${selected}>${categorys[i].name}</option>`;
    }
    return `
      <select name="category">
        ${tag}
      </select>`;
  },

  manage_comments_List: function (comments, href) {
    if (comments.length == 0) {
      var list = `<p style="margin: 0 0 10px 10px; color:gray;font-size:20px">이 화면에서 댓글을 삭제할 수 있습니다.</p>`;
    } else {
      var list = `<ul>`;
      for (var i = 0; i < comments.length; i++) {
        list += `
      <li>
        <div class="comments_cont">
        <span class="name">${comments[i].name}</span>
        <span class="created">${comments[i].created}</span>
        <strong>
          <a href="/category/${comments[i].category_id}/post/${comments[i].post_id}" class="comment">${comments[i].comment}</a>
        </strong>
        <span class="title">${comments[i].title}</span>
        </div>
        <div class="comments_btn">
          <form action="/manage/comments/delete_process" method="post">
            <input type="hidden" name="id" class="hide" value="${comments[i].id}"> 
            <input type="hidden" name="href" class="hide" value="${href}">
            <button type="submit" class="comments_delete">삭제</button>
          </form>   
        </div>
      </li>
      `;
      }
    }
    list += `</ul>`;
    return list;
  },
};
