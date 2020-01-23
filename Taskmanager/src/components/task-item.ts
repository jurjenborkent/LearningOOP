/// <reference path="base-component.ts" />

namespace App {

// taskItem class 

export class TaskItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private task: Task;
  
    get points() {
      if (this.task.points === 1) {
        return '1 point';
      } else {
        return `${this.task.points} points`;
      }
    }
  
    constructor(hostId: string, task: Task) {
      super('single-task', hostId, false, task.id);
      this.task = task;
      console.log(task);
  
      this.configure();
      this.renderContent();
    }
  
    @autoBind
    dragStartHandler(event: DragEvent) {
      event.dataTransfer!.setData('text/plain', this.task.id);
      event.dataTransfer!.effectAllowed = 'move';
    }
  
  
    dragEndHandler(_: DragEvent) {
      console.log('DragEnd');
      console.log(this.task)
    }
  
    configure() {
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
    }
  
    renderContent() {
      this.element.querySelector('h2')!.textContent = this.task.title;
      this.element.querySelector('h3')!.textContent = this.points + ' assigned';
      this.element.querySelector('p')!.textContent = this.task.description;
    }
  
  }
}