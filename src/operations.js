import { n8nClient } from './n8nClient.js';
import { mergeWorkflows, formatError } from './utils.js';
import { validateWorkflowData, validatePartialWorkflow, validateWorkflowId } from './validators.js';

async function listWorkflows() {
  try {
    const response = await n8nClient.get('/workflows');
    return response.data.data.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
      createdAt: workflow.createdAt,
      updatedAt: workflow.updatedAt,
    }));
  } catch (error) {
    throw new Error(formatError(error, 'Failed to list workflows'));
  }
}

async function getWorkflow(workflowId) {
  const id = validateWorkflowId(workflowId);
  try {
    const response = await n8nClient.get(`/workflows/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(formatError(error, `Failed to get workflow ${id}`));
  }
}

async function createWorkflow(workflowData) {
  const validated = validateWorkflowData(workflowData);
  try {
    const response = await n8nClient.post('/workflows', validated);
    return response.data.data;
  } catch (error) {
    throw new Error(formatError(error, 'Failed to create workflow'));
  }
}

async function updateWorkflow(workflowId, workflowData) {
  const id = validateWorkflowId(workflowId);
  const updates = validatePartialWorkflow(workflowData);
  try {
    const existingResponse = await n8nClient.get(`/workflows/${id}`);
    const merged = mergeWorkflows(existingResponse.data.data, updates);
    const validated = validateWorkflowData(merged);
    const response = await n8nClient.patch(`/workflows/${id}`, validated);
    return response.data.data;
  } catch (error) {
    throw new Error(formatError(error, `Failed to update workflow ${id}`));
  }
}

async function deleteWorkflow(workflowId) {
  const id = validateWorkflowId(workflowId);
  try {
    await n8nClient.delete(`/workflows/${id}`);
    return { success: true, id };
  } catch (error) {
    throw new Error(formatError(error, `Failed to delete workflow ${id}`));
  }
}

async function activateWorkflow(workflowId, active) {
  const id = validateWorkflowId(workflowId);
  try {
    const response = await n8nClient.post(`/workflows/${id}/activate`, { active });
    return response.data.data;
  } catch (error) {
    throw new Error(formatError(error, `Failed to update activation for workflow ${id}`));
  }
}

export const operations = {
  list_workflows: listWorkflows,
  get_workflow: getWorkflow,
  create_workflow: createWorkflow,
  update_workflow: updateWorkflow,
  delete_workflow: deleteWorkflow,
  activate_workflow: activateWorkflow,
};
