import { useUserInfo } from '@/components/useUserInfo';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { hashPassword } from '@/utils/hashPassword';
import axios from 'axios';

import styles from '@/styles/reg_login-form.module.css';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const { userInfo, error, isLoading } = useUserInfo();
  const [failedToLogin, setFailedToLogin] = useState(false);
  const router = useRouter();

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Connection Error</div>;

  if (userInfo) {
    router.replace('/');
    return;
  }

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
