import { runQuery } from '@/utils/runQuery';

export default async function handler(req, res) {
  res.send(
    (await runQuery('SELECT NEXT_QUESTION_ID() AS "nextId" FROM DUAL')).rows[0]
  );
}
