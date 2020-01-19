// taak status class

class TaskState {
  private tasks: any[] = [];

  addTask(title: string, description: string, points: number) {
    const newTask = {
      id:Math.random().toString(),
      title: title,
      description: description,
      points: points
    }
    this.tasks.push(newTask);
  }
}

const taskState = new TaskState();


// validation voor het input veld

interface Validator {
  value: string | number
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validator) {

  // hier voeren we een check uit op voorwaarden die gelden bij het invullen van velden.

  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length > validatableInput.minLength;
  }

  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
  }

  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }

  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }

  return isValid
}


// autoBind decorator 

function autoBind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDecriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDecriptor;
}

class TaskInputForm {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  pointsInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('task-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedHtmlContent = document.importNode(this.templateElement.content, true);
    this.element = importedHtmlContent.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.pointsInputElement = this.element.querySelector('#points') as HTMLInputElement;

    this.configure();
    this.attach();
  }

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
      min: 1,
      max: 5
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
      console.log(title, desc, points)
      this.clearForm();
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

// taken lijst class voor het maken van lijsten waar taken in gezet gaan worden.

class TaskList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: 'to do' | 'doing' | 'verify' | 'done') {
    this.templateElement = document.getElementById('tasks-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedHtmlContent = document.importNode(this.templateElement.content, true);
    this.element = importedHtmlContent.firstElementChild as HTMLElement;
    this.element.id = `${type}-tasks`
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-tasks-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase();
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}




const prjInput = new TaskInputForm();
const toDoTaskList = new TaskList('to do');
const doingTaskList = new TaskList('doing');
const verifyTaskList = new TaskList('verify');
const doneTaskList = new TaskList('done');
