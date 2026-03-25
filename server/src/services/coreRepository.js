import mongoose from "mongoose";
import { persistData } from "../data/persistence.js";

function usingDatabase() {
  return mongoose.connection.readyState === 1;
}

async function ensureSeed(model, fallbackCollection, prepareSeed) {
  if (!usingDatabase()) {
    return;
  }

  const count = await model.countDocuments();
  if (count === 0 && fallbackCollection.length > 0) {
    const seedRecords = prepareSeed ? await prepareSeed(fallbackCollection) : fallbackCollection;
    await model.insertMany(seedRecords, { ordered: false });
  }
}

export function createRepository({ model, collection, prepareSeed }) {
  return {
    async seed() {
      await ensureSeed(model, collection, prepareSeed);
    },
    async list() {
      if (usingDatabase()) {
        const records = await model.find().sort({ createdAt: -1, _id: -1 }).lean();
        return records.map(stripMongoFields);
      }
      return collection;
    },
    async findOne(filters) {
      if (usingDatabase()) {
        const record = await model.findOne(filters).lean();
        return stripMongoFields(record);
      }

      return collection.find((item) =>
        Object.entries(filters).every(([key, value]) => item[key] === value)
      ) || null;
    },
    async getById(id) {
      if (usingDatabase()) {
        const record = await model.findOne({ id }).lean();
        return stripMongoFields(record);
      }

      return collection.find((item) => item.id === id) || null;
    },
    async create(record) {
      if (usingDatabase()) {
        const created = await model.create(record);
        return stripMongoFields(created.toObject());
      }
      collection.unshift(record);
      await persistData();
      return record;
    },
    async update(id, updates) {
      if (usingDatabase()) {
        const updated = await model.findOneAndUpdate({ id }, updates, { new: true, lean: true });
        return updated ? stripMongoFields(updated) : null;
      }

      const index = collection.findIndex((item) => item.id === id);
      if (index === -1) {
        return null;
      }

      collection[index] = { ...collection[index], ...updates, id: collection[index].id };
      await persistData();
      return collection[index];
    },
    async remove(id) {
      if (usingDatabase()) {
        const removed = await model.findOneAndDelete({ id }).lean();
        return removed ? stripMongoFields(removed) : null;
      }

      const index = collection.findIndex((item) => item.id === id);
      if (index === -1) {
        return null;
      }

      const [removed] = collection.splice(index, 1);
      await persistData();
      return removed;
    }
  };
}

function stripMongoFields(record) {
  if (!record) {
    return record;
  }

  const { _id, __v, ...rest } = record;
  return rest;
}
