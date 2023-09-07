import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import { runQuery } from '@/utils/runQuery';
import axios from 'axios';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';

export default function EditBlog({ info }) {
  const [error, setError] = useState('');
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: info.title,
      body: info.body,
    },
    onSubmit: async (values) => {
      console.log(values);
      setError('');
      const response = await axios.post('/api/editBlog', {
        ...values,
        id: info.id,
      });
      if (response.data.success) {
        router.replace('/');
      } else setError(error);
    },
  });

  return (
    <>
      <Head>
        <title>Edit Blog</title>
      </Head>
      <Container style={{ margin: '2em auto' }}>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              value={formik.values.title}
              onChange={formik.handleChange}
              name="title"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Blog content</Form.Label>
            <Form.Control
              as="textarea"
              style={{ height: '50vh' }}
              value={formik.values.body}
              onChange={formik.handleChange}
              required
              name="body"
            />
          </Form.Group>
          <Button type="submit" variant="success" style={{ marginTop: '1em' }}>
            Submit
          </Button>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
      </Container>
      ;
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { id } = context.query;
    const { username } = getUserInfoFromRequest(context.req);

    const postedByResult = await runQuery(
      'SELECT "postedBy" FROM BLOGS WHERE "id"=:id',
      false,
      { id }
    );
    const postedBy = postedByResult.rows[0].postedBy;

    if (postedBy != username) {
      const { res } = context;
      res.setHeader('location', '/');
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }

    const info = (
      await runQuery(
        'SELECT "id", "body", "title" FROM BLOGS WHERE "id"=:id',
        false,
        { id }
      )
    ).rows[0];

    return { props: { info } };
  } catch (e) {
    console.log(e);
    const { res } = context;
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
}
