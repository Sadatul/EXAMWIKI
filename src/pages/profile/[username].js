import { Profile } from '@/components/Profile';
import { runQuery } from '@/utils/runQuery';
import Head from 'next/head';

import nookies, { destroyCookie } from 'nookies';
import jwt from 'jsonwebtoken';
import { Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function UserProfilePage(props) {
  const router = useRouter();

  return (
    <Container>
      <Head>
        <title>{props.username + ' - Examwiki'}</title>
      </Head>
      {props.hasAccess && (
        <div style={{ marginTop: '1em' }}>
          <Link href={'/editProfile'}>Edit profile</Link>
        </div>
      )}
      <Profile props={props} />

      {props.hasAccess && (
        <Button
          variant="danger"
          onClick={async () => {
            await fetch('/api/logout');
            destroyCookie(null, 'token', { path: '/' });
            router.reload();
          }}
        >
          Logout
        </Button>
      )}
    </Container>
  );
}

export async function getServerSideProps(context) {
  const { username: queryUsername } = context.query;

  let hasAccess = false;

  const cookies = nookies.get(context);
  try {
    const { token } = cookies;
    const { username } = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    if (username == queryUsername) hasAccess = true;
  } catch (e) {}

  const result = await runQuery(
    'SELECT * FROM USERS WHERE "username"=:username',
    false,
    { username: queryUsername }
  );

  if (result.rows.length == 0) {
    return { notFound: true };
  }

  const { firstname, lastname, instituition, email, contribution, image } =
    result.rows[0];

  const typeResult = await runQuery(
    'SELECT IS_STUDENT(:username) AS "TYPE" FROM DUAL',
    false,
    { username: queryUsername }
  );
  const type = typeResult.rows[0].TYPE == 'Y' ? 'student' : 'teacher';

  const typeSpecificResult = await runQuery(
    `SELECT * FROM ${
      type == 'student' ? 'STUDENTS' : 'TEACHERS'
    } WHERE "username"=:username`,
    false,
    { username: queryUsername }
  );

  const specificAttributes = typeSpecificResult.rows[0];
  delete specificAttributes.username;

  return {
    props: {
      username: queryUsername,
      type,
      firstname,
      lastname,
      instituition,
      email,
      contribution,
      image,
      hasAccess,
      ...specificAttributes,
    },
  };
}
