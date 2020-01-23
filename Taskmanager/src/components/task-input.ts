/// <reference path="base-component.ts" />
/// <reference path="../val/validator.ts" />

namespace App {

export class TaskInputForm extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    pointsInputElement: HTMLInputElement;
  
    constructor() {
      super('task-input', 'app', true, 'user-input');
      this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
      this.pointsInputElement = this.element.querySelector('#points') as HTMLInputElement;
      this.configure();
    }
  
    configure() {
      this.element.addEventListener('submit', this.submitHandler);
    }
  
    renderContent() { };
  
  
    private gatherFormInput(): [string, string, number] | void {
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPoints = this.pointsInputElement.value;
  
      const titleValidatable: Validator = {
        value: enteredTitle,
        required: true,
      };
  
      const descriptionValidatable: Validator = {
        value: enteredDescription,
        required: true,
        minLength: 5
      };
  
      const pointsValidatable: Validator = {
        value: +enteredPoints,
        required: true,
        min: 0,
        max: 12
      };
  
      if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(pointsValidatable)
      ) {
        alert('Vul het formulier goed in');
        return;
      } else {
        return [enteredTitle, enteredDescription, +enteredPoints];
      }
    }
  
    private clearForm() {
      this.titleInputElement.value = '';
      this.descriptionInputElement.value = '';
      this.pointsInputElement.value = '';
    }
  
    @autoBind
    private submitHandler(event: Event) {
      event.preventDefault();
      const taskInput = this.gatherFormInput();
      if (Array.isArray(taskInput)) {
        const [title, desc, points] = taskInput;
        taskState.addTask(title, desc, points);
        this.clearForm();
      }
    }
  }
}
