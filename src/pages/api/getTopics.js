import { runQuery } from '@/utils/runQuery';

export default async function handler(req, res) {
  res.send({
    topics: (
      await runQuery(
        `SELECT "topicId", "class" || ': ' || "subject" || ', '  || "chapter" || ', ' || "topic" AS "topic" FROM TOPICINFO`,
        false,
        {}
      )
    ).rows,
  });
}
