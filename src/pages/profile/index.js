import nookies from 'nookies';
import jwt from 'jsonwebtoken';

export default function ProfilePage(props) {
  return <></>;
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);

  let redirectURL = '/login';

  try {
    const { token } = cookies;
    const { username } = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    redirectURL = `/profile/${username}`;
  } catch (e) {
  } finally {
    const { res } = ctx;
    res.setHeader('location', redirectURL);
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
}
