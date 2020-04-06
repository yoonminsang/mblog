$(".btn_delete").click(function() {
  $(this).parent("div").append(`
  <div class="delete_box">
    <input type="password" name="password" placeholder="비밀번호" class="ps">
    <button type="submit" class="confirm">확인</button>
    <button type="button" class="cancle">x</button>
  </div>
    `);
  $(".cancle").click(function() {
    $(this)
      .parent("div")
      .remove();
  });
});
