import { useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { filterTools, tools } from '@tools/index';
import { validNamespaces } from '../i18n';
import { useUserTypeFilter } from '../providers/UserTypeFilterProvider';
import CategoryIcon from './CategoryIcon';

export default function ToolSearch({
  autoFocus = false,
  onSelect
}: {
  autoFocus?: boolean;
  onSelect?: () => void;
}) {
  const { t } = useTranslation(validNamespaces);
  const { selectedUserTypes } = useUserTypeFilter();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const results = useMemo(
    () => filterTools(tools, query, selectedUserTypes, t).slice(0, 30),
    [query, selectedUserTypes, t]
  );

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      disablePortal={Boolean(onSelect)}
      options={results}
      inputValue={query}
      onInputChange={(_event, value, reason) => {
        if (reason === 'input' || reason === 'clear') setQuery(value);
      }}
      getOptionLabel={(tool) => t(tool.name)}
      isOptionEqualToValue={(option, value) => option.path === value.path}
      filterOptions={(options) => options}
      noOptionsText={t('translation:hero.search.noResult')}
      onChange={(_event, tool) => {
        if (tool) {
          navigate('/' + tool.path);
          setQuery('');
          onSelect?.();
        }
      }}
      popupIcon={null}
      ListboxProps={{ sx: { maxHeight: 360, p: 1 } }}
      componentsProps={{
        paper: {
          sx: {
            mt: 1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: '0 16px 40px #11182718'
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus={autoFocus}
          placeholder={t('translation:hero.search.placeholder')}
          inputProps={{
            ...params.inputProps,
            'aria-label': t('translation:hero.search.placeholder')
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: 'text.secondary', ml: 0.5 }} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: 'background.paper',
              minHeight: 58,
              borderRadius: 2,
              boxShadow: '0 4px 16px #11182705',
              pr: '12px !important'
            }
          }}
        />
      )}
      renderOption={(props, tool) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            component="li"
            key={String(key) + '-' + tool.path}
            {...optionProps}
            sx={{ borderRadius: 1.5, gap: 1.5, py: '10px !important' }}
          >
            <CategoryIcon category={tool.type} size={36} />
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontSize={14} fontWeight={650}>
                {t(tool.name)}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {t(tool.shortDescription)}
              </Typography>
            </Stack>
            <ArrowOutwardIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          </Box>
        );
      }}
    />
  );
}
