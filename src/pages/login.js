import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { hashPassword } from '@/utils/hashPassword';
import axios from 'axios';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

import styles from '@/styles/reg_login-form.module.css';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [failedToLogin, setFailedToLogin] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      const data = JSON.parse(JSON.stringify(values));
      data.password = hashPassword(values.password);
      const response = await axios.post('/api/loginUser', data);
      if (response.data.success) router.replace('/');
      else setFailedToLogin(true);
    },
  });

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <Container style={{ margin: '2em auto' }}>
        <Form onSubmit={formik.handleSubmit} className={styles.form}>
          <Form.Control
            placeholder="username"
            value={formik.values.username}
            name="username"
            onChange={formik.handleChange}
          />
          <Form.Control
            type="password"
            placeholder="Password"
            value={formik.values.password}
            name="password"
            onChange={formik.handleChange}
            required
          />

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
        {failedToLogin && (
          <Alert variant="danger" style={{ margin: '2em 0' }}>
            Username or password does not exist
          </Alert>
        )}
        <Link href="/register">Create new account</Link>
      </Container>
    </>
  );
}

export function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);

  try {
    const { token } = cookies;
    jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    const { res } = ctx;
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  } catch (e) {}
  return { props: {} };
}
