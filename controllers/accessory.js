module.exports = {
  get(req, res) {
    res.render('createAccessory', { title: 'Create Accessory' });
  },
  async post(req, res) {
    const accessory = {
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl || undefined,
      price: Number(req.body.price),
    };

    try {
      await req.accessory.createAccessory(accessory);
      res.redirect('/');
    } catch (error) {
      res.redirect('/accessory');
    }
  },
};