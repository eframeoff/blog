// обработчики событий,
//отправка запроса на сервер,
//обработка данных с сервера
/* eslint-disable no-undef */

$(function () {
  // toggle 12
  // remove errors
  function removeErrors() {
    $("form.login p.error, form.register p.error").remove();
    $("form.login input, form.registesr input").removeClass("error");
  }

  var flag = true;
  $(".switch-button").on("click", function (e) {
    e.preventDefault(); // форма не отправляется

    $("input").val("");

    removeErrors();
    if (flag) {
      flag = false;
      $(".register").show("slow");
      $(".login").hide();
    } else {
      flag = true;
      $(".login").show("slow");
      $(".register").hide();
    }
  });

  // clear
  $("form.login input, form.register input").on("focus", function () {
    removeErrors();
  });

  $(".register-button").on("click", function (e) {
    e.preventDefault();
    removeErrors();

    var data = {
      login: $("#register-login").val(),
      password: $("#register-password").val(),
      passwordConfirm: $("#register-password-confirm").val(),
    };
    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/api/auth/register",
    }).done(function (data) {
      if (!data.ok) {
        $(".register h2").after('<p class="error">' + data.error + "</p>");
        if (data.fields) {
          data.fields.forEach(function (item) {
            $("input[name=" + item + "]").addClass("error");
          });
        }
      } else {
        $(location).attr("href", "/");
        //$(".register h2").after('<p class="success">Отлично!</p>');
      }
    });
  });

  $(".login-button").on("click", function (e) {
    e.preventDefault();
    removeErrors();

    var data = {
      login: $("#login-login").val(),
      password: $("#login-password").val(),
    };
    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/api/auth/login",
    }).done(function (data) {
      if (!data.ok) {
        $(".login h2").after('<p class="error">' + data.error + "</p>");
        if (data.fields) {
          data.fields.forEach(function (item) {
            $("input[name=" + item + "]").addClass("error");
          });
        }
      } else {
        //$(".register h2").after('<p class="success">Отлично!</p>');
        $(location).attr("href", "/");
      }
    });
  });
});
/* eslint-enable no-undef */
