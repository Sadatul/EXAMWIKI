import { Blog } from '@/components/Blog';
import { getUserInfoFromRequest } from '@/utils/getUserInfoFromRequest';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';

const blogIncrement = 3;

export default function Home({ authenticated }) {
  const [blogs, setBlogs] = useState([]);
  const [blogCount, setBlogCount] = useState(blogIncrement);

  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/getBlogs?blogCount=${blogCount}`).then((response) =>
      response.json().then((result) => {
        setBlogs(result.blogs);
        setHasMore(result.hasMore);
      })
    );
  }, [blogCount]);

  function handleDelete(deleteId) {
    const newBlogs = [];
    for (const blog of blogs) {
      if (blog.id != deleteId) newBlogs.push(blog);
    }
    setBlogs(newBlogs);
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Container style={{ margin: '0 auto' }}>
        {authenticated && (
          <div style={{ margin: '1em', textAlign: 'center' }}>
            <Button onClick={() => {
              router.push('/createBlog');
            }}>Create Blog</Button>
          </div>
        )}
        <div>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blogId={blog.id}
              authenticated={authenticated}
              title={blog.title}
              body={blog.body}
              date={blog.dateString}
              upvotes={blog.upvotes}
              downvotes={blog.downvotes}
              postedBy={blog.postedBy}
              image={blog.image}
              hasChangeAccess={blog.hasAccess == 'Y'}
              myVote={blog.myVote}
              handleDeleteFromPage={handleDelete}
            />
          ))}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginBottom: '2em' }}>
            <Button onClick={() => setBlogCount(blogCount + blogIncrement)}>
              Show more
            </Button>
          </div>
        )}
      </Container>
    </>
  );
}

export function getServerSideProps(context) {
  try {
    const { username } = getUserInfoFromRequest(context.req);
    return { props: { authenticated: true } };
  } catch (e) {
    return { props: { authenticated: false } };
  }
}
