const fs = require('fs/promises');

const filePath = './util/data.json';

const Car = require('../models/Car');

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

function carViewModel(car) {
  return {
    id: car._id,
    name: car.name,
    description: car.description,
    imageUrl: car.imageUrl,
    price: car.price,
  };
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
  const car = await Car.findById(id);

  if (car) {
    return carViewModel(car);
  } else {
    return undefined;
  }

  /*const data = await read();
  const car = data[id];

  if (car) {
    return Object.assign({}, { id }, car);
  } else {
    return undefined;
  }*/
}

async function createCar(car) {
  const newCar = new Car(car);
  await newCar.save();
}

async function deleteById(id) {
  await Car.findByIdAndDelete(id);
}

async function updateById(id, car) {
  await Car.findByIdAndUpdate(id, car);
}

function nexId() {
  return 'xxxxxxxx-xxxx'.replace(/x/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

module.exports = () => (req, res, next) => {
  req.storage = {
    getAll,
    getById,
    createCar,
    deleteById,
    updateById,
  };
  next();
};
