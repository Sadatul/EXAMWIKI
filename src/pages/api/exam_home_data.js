import oracledb from 'oracledb';

import { runQueryFromFile } from '@/utils/runQuery';

export default async function handler(req, res) {
    //   const data = await runQueryFromFile('getAllUsers');
    //   res.status(200).json(data);
    // console.log({ name: 'John Doe' });
    let data;
    if (req.query.val == '1') {
        data = await runQueryFromFile('getAllClasses');
        console.log(data);
    }
    else if (req.query.val == '2') {
        data = await runQueryFromFile('getSubjectOfClass', false,
            {
                className: { dir: oracledb.BIND_IN, val: req.query.class, type: oracledb.STRING }
            });
        console.log(data);
    }
    res.json(data);
}
