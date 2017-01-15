/**
 * Created by ania on 1/15/17.
 */

//node.js - serwis backend

const posts = [];

module.exports = (app) => {
  app.get('/hello', (req, res) => {
      res.json({ hello: 'world'});
  });

  app.get('/posts', (req, res) => {
      res.json(posts);
  });

  app.post('/post', (req, res) => {
      posts.push(req.body);
      res.json(req.body);
  })
};
