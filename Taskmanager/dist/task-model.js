"use strict";
var App;
(function (App) {
    let TaskStatus;
    (function (TaskStatus) {
        TaskStatus[TaskStatus["Todo"] = 0] = "Todo";
        TaskStatus[TaskStatus["Doing"] = 1] = "Doing";
        TaskStatus[TaskStatus["Verify"] = 2] = "Verify";
        TaskStatus[TaskStatus["Done"] = 3] = "Done";
    })(TaskStatus = App.TaskStatus || (App.TaskStatus = {}));
    let TaskDrops;
    (function (TaskDrops) {
        TaskDrops["Todo"] = "todo-tasks";
        TaskDrops["Doing"] = "doing-tasks";
        TaskDrops["Verify"] = "verify-tasks";
        TaskDrops["Done"] = "done-tasks";
    })(TaskDrops = App.TaskDrops || (App.TaskDrops = {}));
    class Task {
        constructor(id, title, description, points, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.points = points;
            this.status = status;
        }
    }
    App.Task = Task;
})(App || (App = {}));
