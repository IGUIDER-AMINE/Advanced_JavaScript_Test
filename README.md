# Function Code
function assignTasksWithPriorityAndDependencies(developers, tasks) {
  // Prioritizes high-priority tasks while balancing the workload
  tasks.sort((a, b) => b.priority - a.priority);
  // Lists unassigned tasks if no developer can handle them
  const unassignedTasks = [];
  const completedTasks = new Set();

  const developerAssignments = developers.map((dev) => ({
    name: dev.name,
    skillLevel: dev.skillLevel,
    maxHours: dev.maxHours,
    preferredTaskType: dev.preferredTaskType,
    tasks: [],
    totalWorkHours: 0,
  }));

  //Assigns tasks to developers
  const findProperDevloper = (task) => {
    return developerAssignments
      .filter(
        (dev) =>
          dev.skillLevel >= task.difficulty &&
          dev.maxHours >= task.hoursRequired + dev.totalWorkHours
      )
      .sort(
        (a, b) =>
          b.skillLevel - a.skillLevel || a.totalWorkHours - b.totalWorkHours
      )[0];
  };

  for (const task of tasks) {
    //  Ensures that tasks with dependencies are only assigned after their prerequisites are complete
    // if task.dependencies is empty return true
    if (task.dependencies.every((dep) => completedTasks.has(dep))) {
      const properDeveloper = findProperDevloper(task);
      if (properDeveloper) {
        properDeveloper.tasks.push(task.taskName);
        properDeveloper.totalWorkHours += task.hoursRequired;
        completedTasks.add(task.taskName);
      } else {
        unassignedTasks.push(task);
      }
    } else {
      unassignedTasks.push(task);
    }
  }

  return {
    assigned: developerAssignments,
    unassigned: unassignedTasks.map((task) => task.taskName),
  };
}