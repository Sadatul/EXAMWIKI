import nookies from 'nookies';
import jwt from 'jsonwebtoken';

export function getUserInfoFromRequest(req) {
  const { token } = nookies.get({ req });
  const info = jwt.verify(token, process.env.JWT_SECRET, {
    ignoreExpiration: true,
  });
  return info;
}
