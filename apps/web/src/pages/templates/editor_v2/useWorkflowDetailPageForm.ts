import { INotificationTemplate } from '@novu/shared';
import { useFormContext, SubmitHandler, useWatch } from 'react-hook-form';
import { useUpdateTemplate } from '../../../api/hooks';
import { useUpdateWorkflowChannelPreferences } from '../../../hooks/workflowChannelPreferences/useUpdateWorkflowChannelPreferences';
import { WorkflowDetailFormContext } from '../../../studio/components/workflows/preferences/WorkflowDetailFormContextProvider';
import { errorMessage, successMessage } from '../../../utils/notifications';
import { useEffectOnce } from '../../../hooks';
import { captureException } from '@sentry/react';

type UseWorkflowDetailPageFormProps = {
  templateId: string;
  workflow: INotificationTemplate | undefined;
};

export const useWorkflowDetailPageForm = ({ templateId, workflow }: UseWorkflowDetailPageFormProps) => {
  const {
    formState: { dirtyFields, isValid },
    resetField,
    reset,
    handleSubmit,
    getValues,
  } = useFormContext<WorkflowDetailFormContext>();

  const workflowName = useWatch({ name: 'general.name' });

  const { updateWorkflowChannelPreferences, isLoading: isUpdatingPreferences } = useUpdateWorkflowChannelPreferences(
    templateId,
    {
      onSuccess: () => {
        resetField('preferences');
      },
    }
  );
  const { updateTemplateMutation, isLoading: isUpdatingGeneralSettings } = useUpdateTemplate({
    onSuccess: () => {
      resetField('general');
    },
  });

  const hasChanges = Object.keys(dirtyFields).length > 0;

  const onSubmit: SubmitHandler<WorkflowDetailFormContext> = async (data) => {
    try {
      if (dirtyFields?.general) {
        const { workflowId, ...templateValues } = getValues('general');
        await updateTemplateMutation({ id: templateId, data: { ...templateValues, identifier: workflowId } });
      }

      if (dirtyFields?.preferences) {
        await updateWorkflowChannelPreferences(getValues('preferences'));
      }

      successMessage('Workflow updated successfully');

      reset(data);
    } catch (e: any) {
      errorMessage(e.message || 'Unexpected error occurred');
      captureException(e);
    }
  };

  useEffectOnce(() => {
    if (!workflow) return;

    reset({
      general: {
        workflowId: workflow.triggers?.[0]?.identifier ?? '',
        name: workflow.name,
      },
    });
  }, !!workflow);

  return {
    submitWorkflow: handleSubmit(onSubmit),
    hasChanges,
    isValid,
    isSubmitting: isUpdatingGeneralSettings || isUpdatingPreferences,
    workflowName,
  };
};
