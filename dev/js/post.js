/* eslint-disable no-undef */

$(function () {
  /* eslint-disable-next-line */
  // var editor = new MediumEditor("#post-body", {
  //   placeholder: {
  //     text: "",
  //     hideOnClick: true,
  //   },
  // });

  //remove errors
  function removeErrors() {
    $(".post-form p.error").remove();
    $(".post-form input, #post-body").removeClass("error");
  }

  // clear
  $(".post-form input, #post-body").on("focus", function () {
    removeErrors();
  });

  // publish title
  $(".publish-button, .save-button").on("click", function (e) {
    e.preventDefault();
    removeErrors();

    var isDraft = $(this).attr("class").split(" ")[0] === "save-button";

    var data = {
      title: $("#post-title").val(),
      body: $("#post-body").val(),
      isDraft: isDraft,
      postId: $("#post-id").val(),
    };
    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "/post/add",
    }).done(function (data) {
      console.log(data);
      if (!data.ok) {
        $(".post-form h2").after('<p class="error">' + data.error + "</p>");
        if (data.fields) {
          data.fields.forEach(function (item) {
            $("#post-" + item).addClass("error");
          });
        }
      } else {
        if (isDraft) {
          $(location).attr("href", "/post/edit/" + data.post.id);
        } else {
          $(location).attr("href", "/posts/" + data.post.url);
        }
        //     //$(".register h2").after('<p class="success">Отлично!</p>');
        // $(location).attr("href", "/");
      }
    });
  }); // toggle 12

  // upload pictures
  $("#file").on("change", function () {
    //e.preventDefault();

    var formData = new FormData();
    formData.append("postId", $("#post-id").val());
    formData.append("file", $("#file")[0].files[0]);

    $.ajax({
      type: "POST",
      url: "/upload/image",
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data);
        $("#fileinfo").prepend(
          '<div class="img-container"><img src="/uploads' +
            data.filePath +
            '" alt="" /></div>'
        );
      },
      error: function (e) {
        console.log(e);
      },
    });
  });
});

/* eslint-enable no-undef */
