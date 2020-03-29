$(".bt_category_add").click(function() {
  var i;
  for (i = 1; i <= $(".bundle_item").length; i++) {}
  $(".bt_category_add").attr("class", "bt_category_add_off");
  $(".bt_category_add_off").attr("disabled", true);
  $("#field").append(`
  <div class='bundle_item_add' id='${i}'>
    <img src='/static/images/category.png' alt='카테고리' />
    <form action='/manage/category/create_process' method='post'>
      <input type='text' class='tx_category' maxlength='30' name='name' value=''>
        <div class='order'>
          <button type='reset' class='bt_cancle'> 취소 </button>
          <button type='submit' class='bt_confirm' > 확인 </button>
        </div>
    </form>
  </div>
  `);
  $(".bt_cancle").click(function() {
    $(".bt_category_add_off").attr("class", "bt_category_add");
    $(".bt_category_add").attr("disabled", false);
    $("#" + i).remove();
  });
});

$("#field").on("click", ".bt_category_modify", function(event) {
  // event.preventDefault();
  $(".bt_category_add").attr("class", "bt_category_add_off");
  $(".bt_category_add_off").attr("disabled", true);
  var name = $(this)
    .parent("div")
    .children("span")
    .text();
  var id = $(this)
    .parent("div")
    .attr("id");
  var val = $(this)
    .parent("div")
    .children("form")
    .children(".hidden")
    .val();
  $("#" + id)
    .children()
    .remove("span, form, input, button");
  $("#" + id).append(`
  <form action='/manage/category/update_process' method='post'>
    <input type='hidden' name='id' value='${val}'>
    <input type='text' class='tx_category' maxlength='30' name='name' value='${name}'>
    <div class='order'>
      <button type='reset' class='bt_cancle'> 취소 </button>
      <button type='submit' class='bt_confirm' > 확인 </button>
    </div>
  </form>
  `);
  $("#" + id).attr("class", "bundle_item_add");

  $(".bt_cancle").click(function() {
    $(".bt_category_add_off").attr("disabled", false);
    $(".bt_category_add_off").attr("class", "bt_category_add");
    $("#" + id)
      .children()
      .remove("form");
    $("#" + id).append(`
    <span class='tx_name'>${name}</span>
      <form action="/manage/category/delete_process" method="post">
        <input type="hidden" name="id" class= "hidden" value="${id}">
        <input type='submit' class='bt_category_delete' value='삭제'></input>
      </form>
      <input type='button' class='bt_category_modify' value='수정'></input> 
    `);
    $("#" + id).attr("class", "bundle_item");
  });
});
