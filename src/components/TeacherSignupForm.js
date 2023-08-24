import axios from 'axios';
import { useFormik } from 'formik';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';

import styles from '@/styles/reg_login-form.module.css';
import { hashPassword } from '@/utils/hashPassword';
import { useState } from 'react';

export function TeacherForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      institution: '',
      email: '',
      password: '',
      class: '',
      subject: '',
    },
    onSubmit: async (values) => {
      const data = JSON.parse(JSON.stringify(values));
      data.image = null;
      data.password = hashPassword(data.password);
      const response = await axios.post('/api/createTeacher', data);
      if (response.data.success) router.replace('/');
      else setErrorMessage(response.data.error);
    },
  });

  return (
    <Container style={{ margin: '2em auto' }}>
      <Form onSubmit={formik.handleSubmit} className={styles.form}>
        <Form.Control
          placeholder="Username"
          value={formik.values.username}
          name="username"
          onChange={formik.handleChange}
          required
        />
        <Form.Control
          type="password"
          placeholder="Password"
          value={formik.values.password}
          name="password"
          onChange={formik.handleChange}
          required
        />
        <Form.Control
          placeholder="First Name"
          value={formik.values.firstName}
          name="firstName"
          onChange={formik.handleChange}
          required
        />
        <Form.Control
          placeholder="Last Name"
          value={formik.values.lastName}
          name="lastName"
          onChange={formik.handleChange}
        />
        <Form.Control
          placeholder="Instituition"
          value={formik.values.institution}
          name="institution"
          onChange={formik.handleChange}
        />
        <Form.Control
          placeholder="Class"
          value={formik.values.class}
          name="class"
          onChange={formik.handleChange}
        />
        <Form.Control
          placeholder="Subject"
          value={formik.values.subject}
          name="subject"
          onChange={formik.handleChange}
        />
        <Form.Control
          placeholder="Email"
          value={formik.values.email}
          name="email"
          onChange={formik.handleChange}
        />
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
      {errorMessage.length != 0 && (
        <Alert variant="danger" style={{ margin: '2em 0' }}>
          {errorMessage}
        </Alert>
      )}
    </Container>
  );
}
