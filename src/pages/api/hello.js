// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import oracledb from 'oracledb';

import { runQueryFromFile } from '@/utils/runQuery';

export default async function handler(req, res) {
  const data = await runQueryFromFile('getAllUsers');
  res.status(200).json(data);
}
