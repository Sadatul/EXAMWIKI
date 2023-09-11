import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { destroyCookie } from 'nookies';
import { runQuery } from '@/utils/runQuery';

export default async function handler(req, res) {

  const { username } = getUserInfoFromRequest(req);

  await runQuery(`INSERT INTO PROCEDURE_FUNCTION_LOG_TABLE VALUES('LOGOUT', 'PROCEDURE', USER, SYSDATE, :username, 'USER')`, true, { username });


  destroyCookie({ res }, 'token', {
    path: '/',
  });
  res.send({ success: true });
}
