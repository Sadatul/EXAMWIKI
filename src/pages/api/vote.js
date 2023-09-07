import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { runQueryFromFile } from '@/utils/runQuery';

export default async function handler(req, res) {
  try {
    const { username } = getUserInfoFromRequest(req);
    const { blogId, vote } = req.body;

    await runQueryFromFile('vote', true, { username, blogId, vote });
    res.send({ success: true });
  } catch (e) {
    console.log(e);
    res.send({ success: false, error: e });
  }
}
