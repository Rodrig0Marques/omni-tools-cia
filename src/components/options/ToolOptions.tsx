import { Box, Stack } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import React, { ReactNode } from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import ToolOptionGroups, { ToolOptionGroup } from './ToolOptionGroups';
import { useTranslation } from 'react-i18next';
import ToolPresets from './ToolPresets';
import type { PresetFields } from '@utils/toolPresets';

export type UpdateField<T> = <Y extends keyof T>(field: Y, value: T[Y]) => void;
type NonEmptyArray<T> = [T, ...T[]];
export type GetGroupsType<T> = (
  formikProps: FormikProps<T> & { updateField: UpdateField<T> }
) => NonEmptyArray<ToolOptionGroup>;

export default function ToolOptions<T extends FormikValues>({
  children,
  getGroups,
  vertical,
  presetFields
}: {
  children?: ReactNode;
  getGroups: GetGroupsType<T> | null;
  vertical?: boolean;
  presetFields?: PresetFields<T>;
}) {
  const { t } = useTranslation();
  const formikContext = useFormikContext<T>();

  // Early return if no groups to display
  if (!getGroups) {
    return null;
  }

  const updateField: UpdateField<T> = (field, value) => {
    formikContext.setFieldValue(field as string, value);
  };

  return (
    <Box
      sx={{
        mb: 2,
        borderRadius: 2,
        padding: { xs: 2, sm: 3 },
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider'
      }}
      mt={3}
    >
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <SettingsIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography component="h2" fontSize={17} fontWeight={650}>
          {t('toolOptions.title')}
        </Typography>
      </Stack>
      <ToolPresets<T> fields={presetFields} />
      <Box mt={3}>
        <Stack direction={'row'} spacing={2}>
          <ToolOptionGroups
            groups={getGroups({ ...formikContext, updateField }) ?? null}
            vertical={vertical}
          />
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
