import { hashPassword } from '@/utils/hashPassword';
import { runQueryFromFile } from '@/utils/runQuery';

export default async function handler(req, res) {
  if (req.method != 'POST') {
    res.status(404).end();
    return;
  }
  try {
    const previousHashPasswordResult = await runQueryFromFile(
      'getHashPassword',
      false,
      { username: req.body.username }
    );
    const previousHashPassword =
      previousHashPasswordResult.rows[0].hashPassword;
    if (previousHashPassword != hashPassword(req.body.previousPassword)) {
      res.send({
        success: false,
        error: 'Password did not match',
      });
      return;
    }

    const password = req.body.password;
    const hash = password ? hashPassword(password) : previousHashPassword;

    const bindVariables = req.body;
    bindVariables.hash = hash;
    delete bindVariables.password;
    delete bindVariables.previousPassword;

    if (!bindVariables.changeImage) {
      const imageResult = await runQueryFromFile('getUserImage', false, {
        username: req.body.username,
      });
      const previousImage = imageResult.rows[0].image;
      bindVariables.image = previousImage;
    }
    delete bindVariables.changeImage;

    console.log(bindVariables);

    await runQueryFromFile('updateTeacher', true, bindVariables);

    res.send({ success: true });
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
}
