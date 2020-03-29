$(document).ready(function() {
  $(".manage_post_btn_see").click(function() {
    if ($(".manage_post_see").length > 0) {
      $(".manage_post_see").attr("class", "manage_post_see_open");
    } else {
      $(".manage_post_see_open").attr("class", "manage_post_see");
    }
  });
});
// $(document).ready(function() {
//   $(".manage_post_btn_see").click(function() {
//     if ($(".manage_post_see").css("display", "none")) {
//       $(".manage_post_see").css("display", "block");
//       alert("22");
//     } else {
//       alert("hi");
//     }
//   });
// });
