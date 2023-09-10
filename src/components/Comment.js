import { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

import emptyProfilePic from '../../none.jpg';

export function Comment({
  id,
  user,
  image,
  blogId,
  body,
  dateString,
  hasChangeAccess,
  authenticated,
  refreshParent,
}) {
  const [showReplySection, setShowReplySection] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(null);

  async function handleToggleReplySection() {
    if (replies == null) await fetchReplies();

    setShowReplySection(!showReplySection);
  }

  async function fetchReplies() {
    const response = await fetch(
      `/api/getComments?blogId=${blogId}&parent=${id}`
    );
    const result = await response.json();
    setReplies(result);
  }

  async function handleReply(event) {
    event.preventDefault();
    const { data } = await axios.post('/api/createComment', {
      body: replyText,
      parent: id,
      blogId,
    });
    if (data.success) {
      await fetchReplies();
      setReplyText('');
    }
  }

  async function handleDelete() {
    const { data } = await axios.post('/api/deleteComment', { id });
    if (data.success) {
      await refreshParent();
    }
  }

  return (
    <Card body style={{ marginTop: '1em' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <b>
            <Image
              src={image || emptyProfilePic}
              alt={user}
              width={40}
              height={40}
              style={{ display: 'inline', marginRight: '0.5em' }}
            />
            <Link href={`/profile/${user}`}>{user}</Link>
          </b>
        </div>
        <div style={{ color: 'grey', fontSize: '0.7rem' }}>
          <i>{dateString}</i>
        </div>
      </div>
      <div style={{ margin: '0.5em 0 0.5em 0' }}>
        {body ? body : <i>This comment was deleted</i>}
      </div>

      {hasChangeAccess && (
        <div style={{ textAlign: 'center' }}>
          <Button
            variant="danger"
            style={{ fontSize: '0.8rem' }}
            onClick={handleDelete}
          >
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
        onClick={handleToggleReplySection}
      >
        {!showReplySection ? 'Expand' : 'Collapse'} Replies
      </span>
      {showReplySection && (
        <div>
          {authenticated && (
            <Form
              style={{ display: 'flex', marginTop: '1em' }}
              onSubmit={(event) => handleReply(event)}
            >
              <Form.Control
                placeholder="Reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button type="submit">Reply</Button>
            </Form>
          )}

          {replies.map((reply) => (
            <Comment
              key={reply.id}
              id={reply.id}
              user={reply.user}
              image={reply.image}
              blogId={blogId}
              body={reply.body}
              dateString={reply.dateString}
              hasChangeAccess={reply.hasAccess == 'Y'}
              authenticated={authenticated}
              refreshParent={fetchReplies}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
