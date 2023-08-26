import { hashPassword } from '@/utils/hashPassword';
import { runQueryFromFile } from '@/utils/runQuery';
import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';

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

      setCookie({ res }, 'token', token, {
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

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
