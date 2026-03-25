export function createCrudController({ repository, buildRecord, buildUpdates }) {
  return {
    list: async (_req, res) => {
      res.json(await repository.list());
    },
    create: async (req, res) => {
      const created = await repository.create(buildRecord(req.body));
      res.status(201).json(created);
    },
    update: async (req, res) => {
      const updated = await repository.update(req.params.id, buildUpdates(req.body));

      if (!updated) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json(updated);
    },
    remove: async (req, res) => {
      const removed = await repository.remove(req.params.id);

      if (!removed) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json({ ok: true });
    }
  };
}
