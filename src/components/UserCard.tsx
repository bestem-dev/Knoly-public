import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';

import { UserData } from '../interfaces';

export default function UserCard(userData: UserData) {
  const { id, name, description, profilePicURL, mainSkill } = userData

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar alt={name} src={profilePicURL}>
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={mainSkill}
      />
      <Link href={`/users/${id}`}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
}
