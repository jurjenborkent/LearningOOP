
namespace App {
    // state management

    type Listener<T> = (items: T[]) => void;

    class State<T> {
        protected listeners: Listener<T>[] = [];

        addListener(listenerFn: Listener<T>) {
            this.listeners.push(listenerFn);
        }
    }

    // taak status class

    export class TaskState extends State<Task> {
        private tasks: Task[] = [];
        private static instance: TaskState;


        private constructor() {
            super()
        }

        private updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.tasks.slice());
            }
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new TaskState();
            return this.instance;
        }


        addTask(title: string, description: string, taskPoints: number) {
            const newTask = new Task(
                Math.random().toString(),
                title,
                description,
                taskPoints,
                TaskStatus.Todo
            );
            this.tasks.push(newTask);
            this.updateListeners();
        }

        moveTask(taskId: string, newStatus: TaskStatus) {
            const task = this.tasks.find(tsk => tsk.id === taskId);
            if (task && task.status !== newStatus) {
                task.status = newStatus;
                this.updateListeners();
                console.log(task)
            }
        }
    }

    export const taskState = TaskState.getInstance();

}