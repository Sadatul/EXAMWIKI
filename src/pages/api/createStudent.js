import { hashPassword } from '@/utils/hashPassword';
import { runQueryFromFile } from '@/utils/runQuery';
import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';

export default async function handler(req, res) {
  if (req.method != 'POST') {
    res.status(404).end();
    return;
  }
  try {
    const password = req.body.password;
    const hash = hashPassword(password);

    const bindVariables = req.body;
    bindVariables.hash = hash;
    delete bindVariables.password;

    console.log(bindVariables);

    await runQueryFromFile('createStudent', true, bindVariables);

    const token = jwt.sign(
      { username: req.body.username, type: 'student' },
      process.env.JWT_SECRET
    );

    setCookie({ res }, 'token', token, {
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
  } catch (e) {
    console.log(e);
    const violatedConstraint = e
      .toString()
      .match(/\(([^)]+)\)/)[1]
      .split('.')[1];
    console.log(violatedConstraint);

    const constraintMap = {
      SYS_C007527: 'Username already exists',
      SYS_C007532: 'Email is not in valid format',
    };

    res.send({
      success: false,
      error: constraintMap[violatedConstraint],
    });
    return;
  }

  res.send({ success: true });
}
