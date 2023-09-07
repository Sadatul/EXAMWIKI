import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { runQuery, runQueryFromFile } from '@/utils/runQuery';

export default async function handler(req, res) {
  const { blogId } = req.query;

  if (!blogId) {
    res.send({ error: 'no blogs specified' });
    return;
  }

  let { parent } = req.query;
  if (!parent) parent = null;

  let username;
  try {
    const info = getUserInfoFromRequest(req);
    username = info.username;
  } catch (e) {
    username = '';
  } finally {
    const result = await runQueryFromFile('getComments', false, {
      username,
      blogId,
      parent,
    });

    res.send(result.rows);
  }
}
