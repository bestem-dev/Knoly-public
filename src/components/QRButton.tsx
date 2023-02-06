import { Fab } from '@mui/material';
import Link from 'next/link';
import { QrCode } from '@mui/icons-material';
import { FC } from 'react';

export const QRButtonStyle = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  backgroundImage: "linear-gradient(215deg, rgba(66,85,233,1) 0%, rgba(64,255,181,1) 100%)"
};

export const QRButton: FC = () => {
  return (
    <Link href={`/users/qr`} passHref>
      <Fab sx={QRButtonStyle} aria-label='qr code'>
        <QrCode />
      </Fab>
    </Link>
  )
};
