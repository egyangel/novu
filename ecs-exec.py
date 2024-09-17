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

  task_details = {}export AWS_ACCESS_KEY_ID="ASIA3FDUJBE4GKCWZ6ML"
                   export AWS_SECRET_ACCESS_KEY="wKpRkwwIvOlEzAhftKkJc+MDXPbzW/T1joN7Q+ai"
                   export AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEDwaDGV1LWNlbnRyYWwtMSJIMEYCIQDtPKO7FtItaLmXfLuAep1/FY/88DLJSKvAhXlAB7iUVAIhAJJDiVV+iRMa7VROcXMvW8P+zZ8kkMkdI0xTtp762aARKtQDCBUQARoMNzY2ODk1NTI0MTUyIgxfk+/rB5P7bnKFuTkqsQNZaHH8In/uFQD04QZnFlWoteHSCrpzq5qMcgiEPxTKbQ+cipkWh+ng5rQs5Kv4JatOl8Jxe0YvcsyubbMle9Vz2HC7HROMi2szAqHUe/J0IyYi7BepvEvKI55DYy434FKAaPSpsPeSCyR295+udIvM7isLre69IZp3RpniLxT+vYtFWYF2UG+f7ZaEvP6wCq4Gi1SyXbnLbhs5hBvitz/yTP0RDHM3R1dFU7EtK9ThzwhXmeX4TtV+FD676zS9gJhFokQDGY5zI7TZdbqF0ovznYHcF8OhqH4vN8PDNBprKzQBYy0VUNeWEcqLWo3aoTiCbT0202bEyue3rde6vreSWsFfm4noB2MgUYNC38RVzr56joDdkL0CyAjotU12nUb1QCVLz2dafDqXHPOdF10I5IaLYTH+mGh5S6coITJl7LqaOXKkYkJeJGOoTBj4i5or6+8utHirpYmBIhTGw0PSr8A+5CIuJIieNE8mZClBadKUcVxve4vDOm/d2oU80yrVHR7YSXadEFqO/HfNIPUNtZWNfIpDb4lD4alk9KSU34ybawuU/CZrAzxkrF+QT3UrMMSP5LQGOqUB4xUXoREYREGclboK/iXOgUowQbPmaK5cntPOFfxl+N1bUrMAbVfHS4mc+CoAvPkoHp2YTi6cekUZ7w4EfRhGsgn0ZFO+rwKU2wItWnMrlwZUylecPqRGow9Zpjj3KV33LKOGctN718uyaaPivHOSBhNtJ3gIbpnyrocGdbdCMvPbDWYqHrJID0MjP5YwQNzc2ZvOFr9eS+p38RociJ0dXYJgUOqf"
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
