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

const developers = [
  { name: "Alice", skillLevel: 7, maxHours: 40, preferredTaskType: "feature" },
  { name: "Bob", skillLevel: 9, maxHours: 30, preferredTaskType: "bug" },
  {
    name: "Charlie",
    skillLevel: 5,
    maxHours: 35,
    preferredTaskType: "refactor",
  },
];

const tasks = [
  {
    taskName: "Feature A",
    difficulty: 7,
    hoursRequired: 15,
    taskType: "feature",
    priority: 4,
    dependencies: [],
  },
  {
    taskName: "Bug Fix B",
    difficulty: 5,
    hoursRequired: 10,
    taskType: "bug",
    priority: 5,
    dependencies: [],
  },
  {
    taskName: "Refactor C",
    difficulty: 9,
    hoursRequired: 25,
    taskType: "refactor",
    priority: 3,
    dependencies: ["Bug Fix B"],
  },
  {
    taskName: "Optimization D",
    difficulty: 6,
    hoursRequired: 20,
    taskType: "feature",
    priority: 2,
    dependencies: [],
  },
  {
    taskName: "Upgrade E",
    difficulty: 8,
    hoursRequired: 15,
    taskType: "feature",
    priority: 5,
    dependencies: ["Feature A"],
  },
];
console.log(
  JSON.stringify(assignTasksWithPriorityAndDependencies(developers, tasks))
);
