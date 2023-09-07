import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Comment } from './Comment';
import Link from 'next/link';

export function Blog({
  blogId,
  title,
  body,
  date,
  upvotes,
  downvotes,
  postedBy,
  hasChangeAccess,
  myVote,
  authenticated,
  handleDeleteFromPage,
}) {
  const [currentVote, setCurrentVote] = useState(myVote);
  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const [downvoteCount, setDownvoteCount] = useState(downvotes);
  const [showCommentSection, setShowCommentSection] = useState(false);

  const [comments, setComments] = useState(null);

  const [commentText, setCommentText] = useState('');

  const router = useRouter();

  async function handleVote(vote) {
    if (vote == currentVote) vote = 'N';
    const { data } = await axios.post('/api/vote', { blogId, vote });

    if (data.success) {
      if (vote == 'N') {
        if (currentVote == 'U') setUpvoteCount(upvoteCount - 1);
        else if (currentVote == 'D') setDownvoteCount(downvoteCount - 1);
      } else if (vote == 'U') {
        if (currentVote == 'D') setDownvoteCount(downvoteCount - 1);
        setUpvoteCount(upvoteCount + 1);
      } else {
        if (currentVote == 'U') setUpvoteCount(upvoteCount - 1);
        setDownvoteCount(downvoteCount + 1);
      }

      setCurrentVote(vote);
    } else {
      console.log(data.error);
    }
  }

  async function handleDelete() {
    const { data } = await axios.post('/api/deleteBlog', { blogId });
    if (data.success) handleDeleteFromPage(blogId);
  }

  function handleEdit() {
    router.push(`/editBlog?id=${blogId}`);
  }

  async function fetchComments() {
    const response = await fetch(`/api/getComments?blogId=${blogId}`);
    const result = await response.json();
    setComments(result);
  }

  async function handleToggleCommentSection() {
    if (comments == null) await fetchComments();

    setShowCommentSection(!showCommentSection);
  }

  async function handleComment(event) {
    event.preventDefault();
    const { data } = await axios.post('/api/createComment', {
      body: commentText,
      parent: null,
      blogId,
    });
    if (data.success) {
      await fetchComments();
      setCommentText('');
    }
  }

  return (
    <Card style={{ margin: '2em' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle>
          <Link href={`/profile/${postedBy}`}>{postedBy}</Link> - {date}
        </Card.Subtitle>
        <Card.Text style={{ whiteSpace: 'pre', margin: '1em 0 1em 0' }}>
          {body}
        </Card.Text>

        {authenticated ? (
          <div style={{ marginBottom: '1.5em' }}>
            <Button
              style={{ marginRight: '1em' }}
              variant={currentVote == 'U' ? 'success' : 'primary'}
              onClick={() => handleVote('U')}
            >
              Upvote ({upvoteCount})
            </Button>
            <Button
              variant={currentVote == 'D' ? 'success' : 'primary'}
              onClick={() => handleVote('D')}
            >
              Downvote ({downvoteCount})
            </Button>
          </div>
        ) : (
          <div>
            {upvoteCount} Upvote{upvoteCount > 1 && 's'}, {downvoteCount}{' '}
            Downvote{downvoteCount > 1 && 's'}
          </div>
        )}
        {hasChangeAccess && (
          <div style={{ textAlign: 'center' }}>
            <Button
              variant="secondary"
              style={{ marginRight: '1em' }}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}

        <span
          style={{
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={handleToggleCommentSection}
        >
          {!showCommentSection ? 'Expand' : 'Collapse'} Comments
        </span>

        {showCommentSection && (
          <div>
            {authenticated && (
              <Form
                style={{ display: 'flex', marginTop: '1em' }}
                onSubmit={(event) => handleComment(event)}
              >
                <Form.Control
                  placeholder="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit">Comment</Button>
              </Form>
            )}

            {comments.map((comment) => (
              <Comment
                key={comment.id}
                id={comment.id}
                user={comment.user}
                blogId={blogId}
                body={comment.body}
                dateString={comment.dateString}
                hasChangeAccess={comment.hasAccess == 'Y'}
                authenticated={authenticated}
                refreshParent={fetchComments}
              />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
