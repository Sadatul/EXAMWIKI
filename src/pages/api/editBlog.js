import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { runQuery, runQueryFromFile } from '@/utils/runQuery';

export default async function handler(req, res) {
  if (req.method != 'POST') {
    res.status(404).end();
    return;
  }

  try {
    console.log(req.body);
    const { username } = getUserInfoFromRequest(req);

    const { id } = req.body;

    const postedByResult = await runQuery(
      'SELECT "postedBy" FROM BLOGS WHERE "id"=:id',
      false,
      { id }
    );
    const postedBy = postedByResult.rows[0].postedBy;

    if (postedBy != username) {
      res.send({ success: false, error: 'not authenticated' });
      return;
    }

    await runQueryFromFile('editBlog', true, req.body);

    res.send({ success: true });
  } catch (e) {
    console.log(e);
    res.send({ sucess: 'false', error: e });
  }
}
