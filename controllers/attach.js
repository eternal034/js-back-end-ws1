module.exports = {
  async get(req, res) {
    const id = req.params.id;

    try {
      const [car, accessories] = await Promise.all([
        req.storage.getById(id),
        req.accessory.getAll(),
      ]);

      if (car.owner != req.session.user.id) {
        console.log('user is not an owner');
        res.redirect('/login');
      }

      const existingAccId = car.accessories.map((a) => a.id.toString());
      const availableAccessories = accessories.filter(
        (accessory) => existingAccId.includes(accessory.id.toString()) == false
      );

      res.render('attach', {
        title: 'Attach Accessory',
        car,
        accessories: availableAccessories,
      });
    } catch (err) {
      res.redirect('404');
    }
  },
  async post(req, res) {
    const carId = req.params.id;
    const accessoryId = req.body.accessory;

    try {
      const couldAttach = await req.storage.attachAccessory(
        carId,
        accessoryId,
        req.session.user.id
      );

      if (couldAttach) {
        res.redirect('/');
      } else {
        console.log('user is not an owner');
        res.redirect('/login');
      }
    } catch (err) {
      res.redirect('/attach/' + carId);
    }
  },
};
