import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from 'react-bootstrap';
import nookies, { destroyCookie } from 'nookies';
import jwt from 'jsonwebtoken';

export default function Home({ username, type }) {
  const router = useRouter();

  function logout() {
    destroyCookie(null, 'token');
    router.replace('/login');
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div>
        {username} : {type}
      </div>
      <Button variant="danger" onClick={logout}>
        Logout
      </Button>
    </>
  );
}

export function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);

  try {
    const { token } = cookies;
    const { username, type } = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    return { props: { username, type } };
  } catch (e) {
    const { res } = ctx;
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
}
