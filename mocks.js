const faker = require("faker");
//const TurndownService = require("turndown");
const tr = require("transliter");

const models = require("./models");

const owner = "5eaea67a82ce922db8502771";

module.exports = async () => {
  try {
    await models.Post.remove();
    Array.from({ length: 20 }).forEach(async () => {
      //const turndownService = new TurndownService();
      const title = faker.lorem.words(5);
      const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;
      const post = await models.Post.create({
        title,
        body: faker.lorem.words(100),
        url,
        owner,
      });
      console.log(post);
    });
  } catch (error) {
    console.log(error);
  }
};
