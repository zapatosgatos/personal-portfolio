$(document).ready(function(){
  /*$(".btn").click(function(){
    $(".card").toggleClass('d-none');
  })*/
  $("form").on('submit',function(){
    $(".alert").toggleClass('d-none');

    console.log("Redirecting...")
    setTimeout(function() {
      window.location.href = "/";
    }, 5000);
  });
});
