import { destroyCookie } from 'nookies';

export default function handler(req, res) {
  destroyCookie({ res }, 'token', {
    path: '/',
  });
  res.send({ success: true });
}
