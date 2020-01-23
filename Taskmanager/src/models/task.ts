namespace App {
    export enum TaskStatus {
        Todo,
        Doing,
        Verify,
        Done
    }

    export enum TaskDrops {
        Todo = 'todo-tasks',
        Doing = 'doing-tasks',
        Verify = 'verify-tasks',
        Done = 'done-tasks',
    }

    export class Task {
        constructor(
            public id: string,
            public title: string,
            public description: string,
            public points: number,
            public status: TaskStatus

        ) { }
    }
}