import { useEffect, useId, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FormikValues, useFormikContext } from 'formik';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  deleteToolPreset,
  getToolPresetsKey,
  maxPresetNameLength,
  pickPresetValues,
  readToolPresets,
  saveToolPreset
} from '@utils/toolPresets';
import type { PresetFields, ToolPreset } from '@utils/toolPresets';

export default function ToolPresets<T extends FormikValues>({
  fields
}: {
  fields?: PresetFields<T>;
}) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { initialValues, values, setValues } = useFormikContext<T>();
  const [presets, setPresets] = useState<ToolPreset[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const selectId = useId();
  const dialogTitleId = useId();
  const nameId = useId();
  const defaultOptions = pickPresetValues(initialValues, initialValues, fields);
  const currentOptions = pickPresetValues(initialValues, values, fields);
  const hasOptions = Object.keys(defaultOptions).length > 0;
  const selectedPreset = presets.find((preset) => preset.name === selectedName);

  useEffect(() => {
    if (!hasOptions) return;

    const loadPresets = () => {
      try {
        setPresets(readToolPresets(pathname));
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    };
    loadPresets();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === getToolPresetsKey(pathname)) {
        loadPresets();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname, hasOptions]);

  if (!hasOptions) return null;

  const applyPreset = () => {
    if (!selectedPreset) return;
    setValues((previous) => ({
      ...previous,
      ...defaultOptions,
      ...pickPresetValues(initialValues, selectedPreset.values, fields)
    }));
  };

  const restoreDefaults = () => {
    setValues((previous) => ({ ...previous, ...defaultOptions }));
    setSelectedName('');
  };

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    try {
      setPresets(saveToolPreset(pathname, name, currentOptions));
      setSelectedName(name.trim());
      setStorageError(false);
      setDialogOpen(false);
    } catch {
      setSaveError(true);
    }
  };

  const handleDelete = () => {
    if (!selectedPreset) return;
    try {
      setPresets(deleteToolPreset(pathname, selectedPreset.name));
      setSelectedName('');
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  };

  return (
    <Box
      mt={2}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'action.hover',
        border: 1,
        borderColor: 'divider'
      }}
    >
      {storageError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('toolPresets.storageError')}
        </Alert>
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        alignItems={{ sm: 'center' }}
      >
        <TextField
          id={selectId}
          select
          label={t('toolPresets.savedConfigurations')}
          value={selectedPreset?.name ?? ''}
          onChange={(event) => setSelectedName(event.target.value)}
          SelectProps={{ native: true }}
          InputLabelProps={{ shrink: true }}
          size="small"
          disabled={presets.length === 0}
          sx={{ minWidth: { sm: 220 }, maxWidth: { sm: 320 }, flex: 1 }}
        >
          <option value="">
            {presets.length ? t('toolPresets.select') : t('toolPresets.empty')}
          </option>
          {presets.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={applyPreset}
          disabled={!selectedPreset}
        >
          {t('toolPresets.apply')}
        </Button>
        <Button
          variant="outlined"
          startIcon={<SaveOutlinedIcon />}
          onClick={() => {
            setName(selectedPreset?.name ?? '');
            setSaveError(false);
            setDialogOpen(true);
          }}
        >
          {t('toolPresets.saveConfiguration')}
        </Button>
        <Button
          startIcon={<RestartAltIcon />}
          onClick={restoreDefaults}
          disabled={
            JSON.stringify(currentOptions) === JSON.stringify(defaultOptions)
          }
        >
          {t('toolPresets.restoreDefaults')}
        </Button>
        {selectedPreset && (
          <Tooltip title={t('toolPresets.delete')}>
            <IconButton
              aria-label={t('toolPresets.delete')}
              onClick={handleDelete}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {t('toolPresets.localOnly')}
      </Typography>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby={dialogTitleId}
        fullWidth
        maxWidth="xs"
        PaperProps={{ component: 'form', onSubmit: handleSave }}
      >
        <DialogTitle id={dialogTitleId}>
          {t('toolPresets.saveConfiguration')}
        </DialogTitle>
        <DialogContent>
          {saveError && (
            <Alert severity="error">{t('toolPresets.storageError')}</Alert>
          )}
          <TextField
            id={nameId}
            autoFocus
            required
            fullWidth
            margin="dense"
            label={t('toolPresets.name')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            inputProps={{ maxLength: maxPresetNameLength }}
            helperText={t('toolPresets.overwriteHint')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            {t('toolPresets.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={!name.trim()}>
            {t('toolPresets.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
