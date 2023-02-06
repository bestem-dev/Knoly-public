import { Avatar, AvatarGroup, Button, Chip, List, ListItem, ListItemText } from '@mui/material';
import { useSession } from 'next-auth/react';
import { validationIdsToSkills } from '@src/utils/validations';
import { CheckCircle } from '@mui/icons-material';
import { User, Skill, Validations } from '@prisma/client';
import { FC, useEffect, useMemo, useState } from 'react';
import { OnlyOtherUsers, OnlyUser } from '@components/AccessControl';
import { LoadingButton } from '@mui/lab';
import { trpc } from '@src/trpc';
import { ValidatorList } from './ValidatorList';
import { useRef } from 'react';

export interface UserValidationsListProps {
  user: User & { validations: Validations[]; };
  skills: Skill[];
}

export const UserValidationsList: FC<UserValidationsListProps> = ({ user, skills }) => {
  const { data: session, status } = useSession();
  const [validatedSkills, setValidatedSkills] = useState<string[]>([])
  const [ validating, setValidating ] = useState<string[]>([])
  const initialValidations = useRef(user.validations)

  useEffect(()=>{
    setValidatedSkills(initialValidations.current
          .filter((v: Validations) => v.validatorId === session?.user.id)
          .map((v) => v.skillId))
  }, [session?.user.id])

  const userValidateMutation = trpc.useMutation("user.validate", {
    onMutate(variables) {
      setValidating((prev) => [...prev, variables.skillId])
    },
    onSuccess(data, variables) {
      setValidatedSkills((prev) => [...prev, variables.skillId]);
    },
    onError(e, variables) {
      console.log("Error posting validation")
      console.log(e)
      // TODO: show error here
    },
    onSettled(data, error, variables) {
      setValidating((prev) => prev.filter((id) => id !== variables.skillId))
    }
  })


  const validateSkill = async (skillId: string) => {
    userValidateMutation.mutateAsync({
      skillId,
      validatorId: session!.user.id,
      receiverId: user.id,
      score: 1 // Will be ignored by the backend
    }).catch()
  }


  return (
    <List>
      {validationIdsToSkills(
        user.validations.filter((v: Validations) => v.validatorId == user.id),
        skills
      ).map((s) => (
        <ListItem
          key={s.id}
        >
          <>
            <ListItemText primary={s.name} secondary={s.description} />

            <OnlyOtherUsers user={user}>
              {validatedSkills?.includes(s.id) ? (
                <CheckCircle />
              )
                : (
                  <LoadingButton
                    loading={validating.includes(s.id)}
                    variant="outlined" sx={{ marginTop: 2 }}
                    onClick={() => validateSkill(s.id)} disabled={status!=="authenticated"}
                  >
                    Validar
                  </LoadingButton>
                )}
            </OnlyOtherUsers>
            <OnlyUser user={user}>
              <ValidatorList skillId={s.id} userId={user.id} validations={user.validations}/>
            </OnlyUser>
          </>
        </ListItem>
      ))}
    </List>
  );
};
