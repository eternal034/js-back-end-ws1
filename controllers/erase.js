module.exports = {
  async get(req, res) {
    const id = req.params.id;
    const car = await req.storage.getById(id);

    if (car.owner != req.session.user.id) {
      console.log('user is not an owner');
      res.redirect('/login');
    }

    if (car) {
      res.render('erase', { title: `Delete Listing - ${car.name}`, car });
    } else {
      res.redirect('404');
    }
  },
  async post(req, res) {
    const id = req.params.id;

    try {
      const couldDelete = await req.storage.deleteById(id, req.session.user.id);
      if (couldDelete) {
        res.redirect('/');
      } else {
        console.log('user is not an owner');
        res.redirect('/login');
      }
    } catch (err) {
      console.log(err);
      res.redirect('404');
    }
  },
};
