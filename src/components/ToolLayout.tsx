import { Container, Divider } from '@mui/material';
import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import ToolHeader from './ToolHeader';
import AllTools from './allTools/AllTools';
import { getToolsByCategory } from '@tools/index';
import { getI18nNamespaceFromToolCategory } from '../utils/string';
import type { IconifyIcon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import type { ToolCategory } from '@tools/defineTool';
import type { FullI18nKey } from '../i18n';

export default function ToolLayout({
  children,
  i18n,
  type,
  fullPath
}: {
  icon?: IconifyIcon | string;
  type: ToolCategory;
  fullPath: string;
  children: ReactNode;
  i18n: {
    name: FullI18nKey;
    description: FullI18nKey;
    shortDescription: FullI18nKey;
  };
}) {
  const { t } = useTranslation([
    'translation',
    getI18nNamespaceFromToolCategory(type)
  ]);
  const toolTitle = t(i18n.name);
  const toolDescription = t(i18n.description);
  const otherCategoryTools =
    getToolsByCategory([], t)
      .find((category) => category.type === type)
      ?.tools.filter((tool) => tool.path !== fullPath)
      .map((tool) => ({
        title: tool.name,
        description: tool.shortDescription,
        link: '/' + tool.path,
        icon: tool.icon,
        category: tool.type
      })) ?? [];

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{ maxWidth: 1328, px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}
    >
      <Helmet>
        <title>{toolTitle + ' — ConquestHub'}</title>
      </Helmet>
      <ToolHeader
        title={toolTitle}
        description={toolDescription}
        type={type}
        path={fullPath}
      />
      {children}
      <Divider sx={{ my: { xs: 4, md: 6 } }} />
      <AllTools
        title={t('translation:frontend.relatedTools')}
        toolCards={otherCategoryTools}
      />
    </Container>
  );
}
