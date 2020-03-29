$(document).ready(function() {
  $(".bt_menu").click(function() {
    if ($(".menu").length > 0) {
      $(".menu").attr("class", "menu_on");
      $(".body").attr("class", "body_on");
      $(".bt_menu img").attr("src", "/static/images/xx.png");
    } else {
      $(".menu_on").attr("class", "menu");
      $(".body_on").attr("class", "body");
      $(".bt_menu img").attr("src", "/static/images/menu.png");
    }
  });

  $(".btn_search_off").click(function() {
    $(".btn_search_off").attr("class", "btn_search");
    $(".btn_search").attr("type", "submit");
    $(".search input").css("display", "inline-block");
    $(".btn_search").click(function() {
      try {
        var value = $("input[name=search]").val();
        window.location.href = "/search/" + value + "/page/1";
        return false;
      } catch (e) {}
    });
  });
});
