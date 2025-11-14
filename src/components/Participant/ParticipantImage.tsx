import { useState } from 'react';
import type { ParticipantPhoto } from '../../types';
import styles from './ParticipantImage.module.css';

interface ParticipantImageProps {
  photo: ParticipantPhoto;
  baseUrl: string;
  participantName: string;
  className: string;
}

export default function ParticipantImage({
  photo,
  baseUrl,
  participantName,
  className,
}: ParticipantImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const lqipUrl = `${baseUrl}w_200,h_360,c_fill,g_face,f_auto,q_85,e_blur:800/${photo.version}/${photo.publicId}`;
  const hqUrl = `${baseUrl}w_1080,h_1920,c_fill,g_face,f_auto,q_90/${photo.version}/${photo.publicId}`;

  return (
    <div className={`${className} ${styles.imageContainer}`}>
      {!isLoaded && (
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner} />
        </div>
      )}

      <img
        className={styles.lqipImage}
        src={lqipUrl}
        alt={participantName}
        draggable="false"
      />

      <img
        className={styles.hqImage}
        src={hqUrl}
        alt={participantName}
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
        draggable="false"
      />
    </div>
  );
}