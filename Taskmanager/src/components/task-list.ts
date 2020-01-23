/// <reference path="base-component.ts" />

namespace App {

export class TaskList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedTasks: Task[];
  
    constructor(private type: 'todo' | 'doing' | 'verify' | 'done') {
      super('tasks-list', 'app', false, `${type}-tasks`);
      this.assignedTasks = [];
  
      this.configure();
      this.renderContent();
    }
    @autoBind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable');
  
      }
    }
    @autoBind
    dropHandler(event: DragEvent) {
      const targetId = (event.target as HTMLElement).parentElement?.id;
      if (!targetId) {
        return; // geen id gevonden
      }
      const taskID = event.dataTransfer!.getData('text/plain');
      switch (targetId) {
        case TaskDrops.Todo: 
          taskState.moveTask(taskID, TaskStatus.Todo);
          break;
        case TaskDrops.Doing: 
          taskState.moveTask(taskID, TaskStatus.Doing);
          break;
        case TaskDrops.Verify: 
          taskState.moveTask(taskID, TaskStatus.Verify);
          break;
        case TaskDrops.Done: 
          taskState.moveTask(taskID, TaskStatus.Done);
          break;
        default: 
          break; // Do niks als er geen target is 
      }
    };
  
    @autoBind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove('droppable');
    }
  
    configure() {
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHandler);
      this.element.addEventListener('drop', this.dropHandler);
  
      taskState.addListener((tasks: Task[]) => {
        const relevantTasks = tasks.filter(tsk => {
          if (this.type === 'todo') {
            return tsk.status === TaskStatus.Todo
          }
          if (this.type === 'doing') {
            return tsk.status === TaskStatus.Doing
          }
          if (this.type === 'verify') {
            return tsk.status === TaskStatus.Verify
          }
          return tsk.status === TaskStatus.Done
        });
        this.assignedTasks = relevantTasks;
        this.renderTasks();
      });
    }
  
    renderContent() {
      const listId = `${this.type}-tasks-list`;
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent = this.type.toUpperCase();
    }
  
    private renderTasks() {
      const listEl = document.getElementById(`${this.type}-tasks-list`)! as HTMLUListElement;
      listEl.innerHTML = '';
      for (const tskItem of this.assignedTasks) {
        new TaskItem(this.element.querySelector('ul')!.id, tskItem);
      }
    }
  }
}