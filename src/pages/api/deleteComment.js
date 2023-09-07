import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { runQuery } from '@/utils/runQuery';

export default async function handler(req, res) {
  try {
    const { username } = getUserInfoFromRequest(req);
    const { id } = req.body;

    const commenter = (
      await runQuery('SELECT "user" FROM COMMENTS WHERE "id"=:id', false, {
        id,
      })
    ).rows[0].user;

    if (username != commenter) {
      res.send({ success: false, error: 'not authenticated' });
      return;
    }

    await runQuery('UPDATE COMMENTS SET "body"=NULL WHERE "id"=:id', true, {
      id,
    });
    res.send({ success: true });
  } catch (e) {
    console.log(e);
    res.send({ success: false, error: e });
  }
}
