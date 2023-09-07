import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { runQuery, runQueryFromFile } from '@/utils/runQuery';

export default async function handler(req, res) {
  let { blogCount } = req.query;
  if (blogCount == undefined) blogCount = 5;

  let username;
  try {
    const info = getUserInfoFromRequest(req);
    username = info.username;
  } catch (e) {
    username = '';
  } finally {
    const totalCountResult = await runQuery(
      'SELECT COUNT(*) AS "totalBlogCount" FROM BLOGS',
      false,
      {}
    );
    const totalCount = totalCountResult.rows[0].totalBlogCount;

    const result = await runQueryFromFile('getBlogs', false, {
      username,
      blogCount,
    });

    res.send({
      blogs: result.rows,
      hasMore: blogCount < totalCount,
    });
  }
}
