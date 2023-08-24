import cookie from 'cookie';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
  );
  res.end();
}
