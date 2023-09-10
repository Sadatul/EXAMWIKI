import { runQuery } from '@/utils/runQuery';

export default async function handler(req, res) {
  let { bound, greaterThan, amount, topicId, difficulty } = req.query;

  if (!bound || (greaterThan != 'true' && greaterThan != 'false') || !amount) {
    res.send({ error: 'Parameter error' });
    return;
  }

  greaterThan = greaterThan == 'true';
  bound = parseInt(bound);
  amount = parseInt(amount);

  const resultBinds = { bound, amount };
  if (topicId) resultBinds.topicId = topicId;
  if (difficulty) resultBinds.difficulty = difficulty;
  const result = await runQuery(
    `SELECT * FROM (SELECT "id", "body", "image", "optionA", "optionB", "optionC", "optionD", "optionE", "answer" FROM QUESTIONS WHERE "id" ${
      greaterThan ? '>' : '<'
    } :bound ${topicId ? ' AND "topicId"=:topicId' : ''}${
      difficulty ? ' AND "difficulty"=:difficulty' : ''
    } ORDER BY ABS("id" - :bound)) WHERE ROWNUM <= :amount ORDER BY "id"`,
    false,
    resultBinds
  );

  const hasMoreResultBinds = {
    bound: greaterThan
      ? result.rows[result.rows.length - 1].id
      : result.rows[0].id,
  };
  if (topicId) hasMoreResultBinds.topicId = topicId;
  if (difficulty) hasMoreResultBinds.difficulty = difficulty;

  const hasMoreResult = await runQuery(
    `SELECT * FROM QUESTIONS WHERE "id" ${greaterThan ? '>' : '<'} :bound${
      topicId ? ' AND "topicId"=:topicId' : ''
    }${difficulty ? ' AND "difficulty"=:difficulty' : ''}`,
    false,
    hasMoreResultBinds
  );

  res.send({
    questions: result.rows,
    hasMore: hasMoreResult.rows != 0,
  });
}
