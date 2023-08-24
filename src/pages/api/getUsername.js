import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  try {
    const { token } = cookie.parse(req.headers.cookie);
    const { username, type } = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    res.status(200).json({ username, type });
  } catch (e) {
    res.status(200).json(null);
  }
}
