import { Avatar, AvatarGroup, Button, Chip, CircularProgress, Dialog, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { validationIdsToSkills } from '@src/utils/validations';
import { CheckCircle } from '@mui/icons-material';
import { User, Skill, Validations } from '@prisma/client';
import { FC, useEffect, useMemo, useState } from 'react';
import { OnlyOtherUsers, OnlyUser } from '@components/AccessControl';
import { LoadingButton } from '@mui/lab';
import { trpc } from '@src/trpc';
import { Box, SxProps } from '@mui/system';
import Link from 'next/link';
import { displayName } from '@src/utils/users';

const style: SxProps = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: "90vw",
  bgcolor: 'backgroud',
  outline: 0,
};

export const ValidatorList: FC<{skillId: string, userId: string, validations: Validations[]}> = ({ skillId, userId, validations}) => {
  const [ modalOpen, setModalOpen ] = useState(false)
  
  const validatorIds = validations
    .filter(v => v.skillId === skillId && v.validatorId !== userId)
    .map(v => v.validatorId)
  const validatorsQuery = trpc.useQuery(["user.fetchMany", {ids: validatorIds }])

  return validatorsQuery.isFetched?
    <>
      <AvatarGroup max={3}
        onClick={() => setModalOpen(true)}
      >
      {validatorsQuery.data?.map((validator) => (
          <Avatar
            src={validator?.profilePicUrl || ""}
            alt={validator?.firstName || ""}
            key={validator.id}
          ></Avatar>
          ))}
      </AvatarGroup>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        {/* <Box sx={style}> */}
          <List sx={{ width: 300, padding: 1 }}>
            {validatorsQuery.data?.map((validator) => (
              <Link href={"/users/" + validator.id} passHref key={validator.id}>
                <ListItem disablePadding key="settings">
                  <ListItemButton>
                    <ListItemIcon>
                      <Avatar alt={validator.firstName || ""} src={validator.profilePicUrl || ""} />
                    </ListItemIcon>
                    <ListItemText primary={displayName(validator)} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        {/* </Box> */}
      </Dialog>
    </>
    :<CircularProgress/>
};
