const fs = require('fs/promises');

const filePath = './util/data.json';

const Car = require('../models/Car');

const { carViewModel } = require('./common');

async function read() {
  try {
    const file = await fs.readFile(filePath);
    return JSON.parse(file);
  } catch (err) {
    console.error(`Database write error`);
    console.error(err);
    process.exit(1);
  }
}

async function write(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Database read error`);
    console.error(err);
    process.exit(1);
  }
}

async function getAll(query) {
  const options = {};

  if (query.search) {
    options.name = new RegExp(query.search, 'i');
  }
  if (query.from) {
    options.price = { $gte: Number(query.from) };
  }
  if (query.to) {
    if (!options.price) {
      options.price = {};
    }

    options.price.$lte = Number(query.to);
  }

  const cars = await Car.find(options);

  return cars.map(carViewModel);
}

async function getById(id) {
  const car = await Car.findById(id).populate('accessories');

  if (car) {
    return carViewModel(car);
  } else {
    return undefined;
  }
}

async function createCar(car) {
  const newCar = new Car(car);
  await newCar.save();
}

async function deleteById(id) {
  await Car.findByIdAndDelete(id);
}

async function updateById(id, car) {
  const toUpdate = await Car.findById(id);
  toUpdate.name = car.name;
  toUpdate.description = car.description;
  toUpdate.imageUrl = car.imageUrl || undefined;
  toUpdate.price = car.price;
  toUpdate.accessories = car.accessories;
  await toUpdate.save();
}

async function attachAccessory(carId, accessoryId) {
  const toUpdateTo = await Car.findById(carId);

  toUpdateTo.accessories.push(accessoryId);

  await toUpdateTo.save();
}

module.exports = () => (req, res, next) => {
  req.storage = {
    getAll,
    getById,
    createCar,
    deleteById,
    updateById,
    attachAccessory,
  };
  next();
};
