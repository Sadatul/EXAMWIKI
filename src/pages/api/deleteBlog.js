import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { runQuery } from '@/utils/runQuery';

export default async function handler(req, res) {
  try {
    const { username } = getUserInfoFromRequest(req);
    const { blogId } = req.body;

    const postedByResult = await runQuery(
      'SELECT "postedBy" FROM BLOGS WHERE "id"=:blogId',
      false,
      { blogId }
    );
    const postedBy = postedByResult.rows[0].postedBy;

    if (postedBy != username) {
      res.send({ success: false, error: 'not authenticated' });
      return;
    }

    await runQuery('DELETE FROM BLOGS WHERE "id"=:blogId', true, { blogId });
    res.send({ success: true });
  } catch (e) {
    console.log(e);
    res.send({ success: false, error: e });
  }
}
