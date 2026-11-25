import { Box, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import type { UserType } from '@tools/defineTool';
import { useTranslation } from 'react-i18next';

interface UserTypeFilterProps {
  selectedUserTypes: UserType[];
  userTypes?: UserType[];
  onUserTypesChange: (userTypes: UserType[]) => void;
}

export default function UserTypeFilter({
  selectedUserTypes,
  onUserTypesChange,
  userTypes = ['generalUsers', 'developers']
}: UserTypeFilterProps) {
  const { t } = useTranslation('translation');
  if (userTypes.length <= 1) return null;
  const chipStyle = {
    cursor: 'pointer',
    fontSize: 12,
    borderRadius: 1.5,
    height: 32,
    '& .MuiChip-label': { px: 1.25 }
  };
  return (
    <Box
      role="group"
      aria-label={t('frontend.filterAudience')}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.75,
        alignItems: 'center'
      }}
    >
      <Chip
        label={t('frontend.everyone')}
        aria-pressed={selectedUserTypes.length === 0}
        variant={selectedUserTypes.length ? 'outlined' : 'filled'}
        color={selectedUserTypes.length ? 'default' : 'primary'}
        onClick={() => onUserTypesChange([])}
        sx={chipStyle}
      />
      {userTypes.map((userType) => {
        const selected = selectedUserTypes.includes(userType);
        return (
          <Chip
            key={userType}
            label={t(`userTypes.${userType}`)}
            icon={
              selected ? (
                <CheckIcon sx={{ fontSize: '16px !important' }} />
              ) : undefined
            }
            aria-pressed={selected}
            variant={selected ? 'filled' : 'outlined'}
            color={selected ? 'primary' : 'default'}
            onClick={() =>
              onUserTypesChange(
                selected
                  ? selectedUserTypes.filter((type) => type !== userType)
                  : [...selectedUserTypes, userType]
              )
            }
            sx={chipStyle}
          />
        );
      })}
    </Box>
  );
}
