const express = require("express");
const router = express.Router();
const moment = require("moment");
moment.locale("ru");
const models = require("../models");
const config = require("../config");

async function posts(req, res) {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const perPage = 3;
  // const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  try {
    const posts = await models.Post.find({
      status: "published",
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate("owner");
    const count = await models.Post.count();
    res.render("archive/index", {
      posts,
      current: page,
      pages: Math.ceil(count / perPage),
      user: {
        id: userId,
        login: userLogin,
      },
    });
  } catch (error) {
    throw new Error("Serv err");
  }
}
//routes
router.get("/", function (req, res) {
  posts(req, res);
});

router.get("/archive/:page", (req, res) => {
  posts(req, res);
});

router.get("/posts/:post", async (req, res, next) => {
  const url = req.params.post.trim().replace(/ +(?= )/g, "");
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!url) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else {
    try {
      const post = await models.Post.findOne({
        url,
        status: "published",
      });
      if (!post) {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
      } else {
        const comments = await models.Comment.find({
          post: post.id,
          parent: { $exists: false },
        });
        // .populate({
        //   path: "children",
        //   populate: {
        //     path: "children",
        //     populate: {
        //       path: "children",
        //     },
        //   },
        // });

        res.render("post/post", {
          post,
          comments,
          moment,
          user: {
            id: userId,
            login: userLogin,
          },
        });
      }
    } catch (error) {
      throw new Error("Serv err");
    }
  }
});

// users post
router.get("/users/:login/:page*?", async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const login = req.params.login;
  const perPage = 3;
  // const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;
  try {
    const user = await models.User.findOne({
      login,
    });
    const posts = await models.Post.find({
      owner: user.id,
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      // населяем поле owner .юзером
      .populate("owner")
      // новый пост в начало
      .sort({ createdAt: -1 });
    const count = await models.Post.count({
      // хозяин постов только юзер с id
      owner: user.id,
    });
    res.render("archive/user", {
      posts,
      _user: user,
      current: page,
      pages: Math.ceil(count / perPage),
      user: {
        id: userId,
        login: userLogin,
      },
    });
  } catch (error) {
    throw new Error("Serv err");
  }
});

module.exports = router;
