import styled from '@emotion/styled';
import { Grid, JsonInput, useMantineTheme } from '@mantine/core';
import { Button, colors, inputStyles, When } from '@novu/design-system';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IForm } from '../../../../pages/templates/components/formTypes';
import { usePreviewInAppTemplate } from '../../../../pages/templates/hooks/usePreviewInAppTemplate';
import { useStepFormPath } from '../../../../pages/templates/hooks/useStepFormPath';
import { useTemplateLocales } from '../../../../pages/templates/hooks/useTemplateLocales';
import Content from './Content';
import { Header } from './Header';
import { useProcessVariables } from '../../../../hooks';
import { api, useEnvController } from '@novu/shared-web';
import { useMutation } from '@tanstack/react-query';
import { useTemplateEditorForm } from '../../../../pages/templates/components/TemplateEditorFormProvider';
import { InputVariables } from '../../../../pages/templates/components/InputVariables';

export function InAppPreview({ showVariables = true }: { showVariables?: boolean }) {
  const theme = useMantineTheme();
  const [payloadValue, setPayloadValue] = useState('{}');
  const { watch, formState } = useFormContext<IForm>();
  const { template } = useTemplateEditorForm();
  const { chimera } = useEnvController({}, template?.chimera);
  const path = useStepFormPath();

  const content = watch(`${path}.template.content`);
  const variables = watch(`${path}.template.variables`);
  const enableAvatar = watch(`${path}.template.enableAvatar`);
  const processedVariables = useProcessVariables(variables);

  const stepId = watch(`${path}.template.name`);
  const [chimeraContent, setChimeraContent] = useState({ content: '', ctaButtons: [] });

  const { mutateAsync, isLoading: isChimeraLoading } = useMutation(
    (data) => api.post('/v1/chimera/preview/' + formState?.defaultValues?.identifier + '/' + stepId, data),
    {
      onSuccess(data) {
        setChimeraContent({
          content: data.outputs.body,
          ctaButtons: [],
        });
      },
    }
  );

  useEffect(() => {
    if (chimera) {
      mutateAsync();
    }
  }, [chimera]);

  const { selectedLocale, locales, areLocalesLoading, onLocaleChange } = useTemplateLocales({
    content: content as string,
  });

  const { isPreviewLoading, parsedPreviewState, templateError, parseInAppContent } = usePreviewInAppTemplate({
    locale: selectedLocale,
  });

  useEffect(() => {
    setPayloadValue(processedVariables);
  }, [processedVariables, setPayloadValue]);

  return (
    <Grid gutter={24}>
      <Grid.Col span={showVariables ? 8 : 12}>
        <ContainerStyled removePadding={showVariables}>
          <Header
            selectedLocale={selectedLocale}
            locales={locales}
            areLocalesLoading={areLocalesLoading || isChimeraLoading}
            onLocaleChange={onLocaleChange}
          />
          <Content
            isPreviewLoading={isPreviewLoading || isChimeraLoading}
            parsedPreviewState={chimera ? chimeraContent : parsedPreviewState}
            templateError={chimera ? '' : templateError}
            showOverlay={!showVariables}
            enableAvatar={enableAvatar}
          />
        </ContainerStyled>
      </Grid.Col>

      <When truthy={showVariables}>
        <Grid.Col span={4}>
          <div
            style={{
              width: '100%',
              height: '100%',
              background: theme.colorScheme === 'dark' ? colors.B17 : colors.B98,
              borderRadius: 7,
              padding: 15,
              paddingTop: 0,
            }}
          >
            <When truthy={!chimera}>
              <JsonInput
                data-test-id="preview-json-param"
                formatOnBlur
                autosize
                styles={inputStyles}
                label="Payload"
                value={payloadValue}
                onChange={setPayloadValue}
                minRows={6}
                mb={20}
                validationError="Invalid JSON"
              />
              <Button
                fullWidth
                onClick={() => {
                  parseInAppContent(payloadValue);
                }}
                variant="outline"
                data-test-id="apply-variables"
              >
                Apply Variables
              </Button>
            </When>
            <When truthy={chimera}>
              <InputVariables
                onSubmit={(values) => {
                  mutateAsync(values);
                }}
                onChange={(values: any) => {
                  mutateAsync(values);
                }}
              />
            </When>
          </div>
        </Grid.Col>
      </When>
    </Grid>
  );
}

const ContainerStyled = styled.div<{ removePadding: boolean }>`
  display: flex;
  padding: 1rem 5rem;
  flex-direction: column;
  gap: 1rem;

  ${({ removePadding }) => removePadding && `padding: 0;`}
`;