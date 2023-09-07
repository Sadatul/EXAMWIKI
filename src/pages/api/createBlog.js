import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { runQueryFromFile } from '@/utils/runQuery';

export default async function handler(req, res) {
  if (req.method != 'POST') {
    res.status(404).end();
    return;
  }

  try {
    console.log(req.body);

    const { username } = getUserInfoFromRequest(req);
    await runQueryFromFile('createBlog', true, { username, ...req.body });
    res.send({ success: true });
  } catch (e) {
    console.log(e);
    res.send({ sucess: 'false', error: e });
  }
}
