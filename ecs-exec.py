import boto3


def list_clusters():
  ecs_client = boto3.client('ecs')
  response = ecs_client.list_clusters()
  return response['clusterArns']


def list_tasks(cluster):
  ecs_client = boto3.client('ecs')
  response = ecs_client.list_tasks(cluster=cluster)
  return response['taskArns']


def describe_task(cluster, task_arn):
  ecs_client = boto3.client('ecs')
  response = ecs_client.describe_tasks(cluster=cluster, tasks=[task_arn])
  return response['tasks'][0]


def execute_command(cluster, task, container_name):
  import os
  command = f"aws ecs execute-command --region eu-central-1 --task {task} --cluster {cluster} --interactive --container {container_name} --command \"/bin/sh\""
  os.system(command)


def main():
  clusters = list_clusters()
  if not clusters:
    print("No clusters found.")
    return

  print("Select a cluster:")
  for idx, cluster in enumerate(clusters, 1):
    print(f"{idx}. {cluster}")

  cluster_choice = int(input("Enter the number of the cluster: ")) - 1
  selected_cluster = clusters[cluster_choice]

  tasks = list_tasks(selected_cluster)
  if not tasks:
    print("No tasks found in the selected cluster.")
    return

  task_details = {}
  for task in tasks:
    task_info = describe_task(selected_cluster, task)
    for container in task_info['containers']:
      container_name = container['name']
      task_details[container_name] = task

  print("Select a task by container name:")
  container_names = list(task_details.keys())
  for idx, container_name in enumerate(container_names, 1):
    print(f"{idx}. {container_name}")

  container_choice = int(input("Enter the number of the container: ")) - 1
  selected_container = container_names[container_choice]
  selected_task = task_details[selected_container]

  execute_command(selected_cluster, selected_task, selected_container)


if __name__ == "__main__":
  main()
