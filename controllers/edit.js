module.exports = {
  async get(req, res) {
    const id = req.params.id;
    const car = await req.storage.getById(id);

    if (car.owner != req.session.user.id) {
      console.log('user is not an owner');
      res.redirect('/login');
    }

    if (car) {
      res.render('edit', { title: `Edit Listing - ${car.name}`, car });
    } else {
      res.redirect('404');
    }
  },
  async post(req, res) {
    const id = req.params.id;
    const car = {
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: Number(req.body.price),
    };

    try {
      const couldUpdate = await req.storage.updateById(
        id,
        car,
        req.session.user.id
      );
      if (couldUpdate) {
        res.redirect('/');
      } else {
        console.log('user is not an owner');
        res.redirect('/login');
      }
    } catch (err) {
      res.redirect('/404');
    }
  },
};
