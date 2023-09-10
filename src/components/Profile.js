import styles from '@/styles/Profile.module.css';
import Image from 'next/image';
import Link from 'next/link';

import emptyProfilePic from '../../none.jpg';

export function Profile({ props }) {
  const info = JSON.parse(JSON.stringify(props));
  delete info.username;
  delete info.image;
  delete info.type;

  if (info.hasAccess != undefined) delete info.hasAccess;
  if (info.isVerified != undefined) delete info.isVerified;

  const imageURL = props.image ? props.image : emptyProfilePic;

  return (
    <div className={styles.containerDiv}>
      <div className={styles.userBox}>
        <div className={styles.titlePhoto}>
          <div className={styles.titlePhotoInnerDiv}>
            <div>
              <div className={styles.imageWrapper}>
                <Image
                  src={imageURL}
                  className={styles.image}
                  width={200}
                  height={200}
                  alt={props.username}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.mainInfo}>
            <div className={styles.userRank}>
              <span className={styles.userGray}>{props.type}</span>
            </div>
            <h1>
              <Link
                href={`/profile/${props.username}`}
                className={styles.profileLink}
              >
                {props.username}
              </Link>{' '}
            </h1>
          </div>
          <ul className={styles.infoList}>
            {Object.keys(info).map((p) => (
              <li key={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)} : {props[p]}
              </li>
            ))}
          </ul>
        </div>
        {props.type == 'student' && (
          <div style={{ marginBottom: '2em' }}>
            <Link href={`/history?username=${props.username}`}>
              Exam history
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
