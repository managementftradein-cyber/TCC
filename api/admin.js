const { sb, tables, requireAdmin } = require('./_supabase');

module.exports = async (req, res) => {
  try {
    await requireAdmin(req);
    const db = sb();

    if (req.method === 'GET') {
      const r = req.query.resource;
      if (!r) {
        const counts = {};
        for (const [k, t] of Object.entries({ subscribers: 'subscribers', prayer: 'prayer_requests', visitors: 'visitors', events: 'events' })) {
          const q = await db.from(t).select('*', { count: 'exact', head: true });
          if (q.error) throw q.error;
          counts[k] = q.count || 0;
        }
        let activity = [];
        for (const t of ['announcements', 'sermons', 'events']) {
          const q = await db.from(t).select('*').order('created_at', { ascending: false }).limit(5);
          if (!q.error) (q.data || []).forEach(x => activity.push({ text: x.title, type: t }));
        }
        return res.json({ counts, activity: activity.slice(0, 10) });
      }
      if (!tables[r]) return res.status(400).json({ error: 'Invalid resource' });
      const q = await db.from(tables[r]).select('*').order('created_at', { ascending: false }).limit(200);
      if (q.error) throw q.error;
      return res.json({ items: q.data || [] });
    }

    if (req.method === 'POST') {
      const { resource, data } = req.body || {};
      if (!tables[resource]) return res.status(400).json({ error: 'Invalid resource' });
      const q = await db.from(tables[resource]).insert(data).select().single();
      if (q.error) throw q.error;
      return res.status(201).json(q.data);
    }

    if (req.method === 'DELETE') {
      const { resource, id } = req.body || {};
      if (!tables[resource] || !id) return res.status(400).json({ error: 'Invalid request' });
      const q = await db.from(tables[resource]).delete().eq('id', id);
      if (q.error) throw q.error;
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(e.status || 500).json({ error: e.message || 'Server error' });
  }
};
