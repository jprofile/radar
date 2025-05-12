'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './BackButton.module.css';

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Ocultar si estamos en la página principal
  if (pathname === '/' || pathname === '/overview') {
    return null;
  }

  return (
    <button
      className={styles.backButton}
      onClick={() => router.push('/overview')}
      aria-label="Volver al radar"
    >
      <Image
        src="/radar_icon_back.png"
        alt="Volver al radar"
        width={32}
        height={32}
        priority
      />
    </button>
  );
}
