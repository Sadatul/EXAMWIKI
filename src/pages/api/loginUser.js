import { hashPassword } from '@/utils/hashPassword';
import { runQueryFromFile } from '@/utils/runQuery';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { reactProductionProfiling } from '../../../next.config';

export default async function handler(req, res) {
  if (req.method != 'POST') {
    res.send(404).end();
    return;
  }
  try {
    const passwordResult = await runQueryFromFile('getHashPassword', false, {
      username: req.body.username,
    });

    const hashedPassword = passwordResult.rows[0].hashPassword;

    const typeResult = await runQueryFromFile('getUserType', false, {
      username: req.body.username,
    });

    if (hashPassword(req.body.password) == hashedPassword) {
      const token = jwt.sign(
        {
          username: req.body.username,
          type: typeResult.rows[0].TYPE == 'Y' ? 'student' : 'teacher',
        },
        process.env.JWT_SECRET
      );

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 1 week
        })
      );

      res.send({ success: true });
      return;
    }
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
    });
    return;
  }

  res.send({ success: false });
}
