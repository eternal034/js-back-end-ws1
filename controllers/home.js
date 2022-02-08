module.exports = {
  async home(req, res) {
    const cars = await req.storage.getAll(req.query);
    res.render('index', { cars, title: 'AutoCat', query: req.query });
  },
};
