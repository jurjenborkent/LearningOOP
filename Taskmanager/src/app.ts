// task Type class 

// enum voor de verschillende statusen van een taak 

enum TaskStatus {
  Todo,
  Doing,
  Verify,
  Done
}

// dragndrop 
interface Draggable {
  dragstartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// validation voor het input veld

interface Validator {
  value: string | number
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

class Task {

  constructor(
    public id: string,
    public title: string,
    public description: string,
    public points: number,
    public taskStatus: TaskStatus
  ) {

  }
}

// state management

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}


// taak status class

class TaskState extends State<Task> {
  private tasks: Task[] = [];
  private static instance: TaskState;


  private constructor() {
    super()
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
    for (const listenerFn of this.listeners) {
      listenerFn(this.tasks.slice());
    }
  }
}

const taskState = TaskState.getInstance();

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


// compenent class voor het renderen van dom elementen
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedHtmlContent = document.importNode(this.templateElement.content, true);
    this.element = importedHtmlContent.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
  }
  abstract configure(): void;
  abstract renderContent(): void;
}

class TaskInputForm extends Component<HTMLDivElement, HTMLFormElement> {
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

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() { };

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

// taskItem class 

class TaskItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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

    this.configure();
    this.renderContent();
  }

  @autoBind
  dragstartHandler(event: DragEvent) {
    console.log(event);
  }

  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragstartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.task.title;
    this.element.querySelector('h3')!.textContent = this.points + ' assigned';
    this.element.querySelector('p')!.textContent = this.task.description;
  }

}


// taken lijst class voor het maken van lijsten waar taken in gezet gaan worden.

class TaskList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedTasks: Task[];

  constructor(private type: 'to do' | 'doing' | 'verify' | 'done') {
    super('tasks-list', 'app', false, `${type}-tasks`);
    this.assignedTasks = [];
    this.configure();
    this.renderContent();
  }

  @autoBind
  dragOverHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.add('droppable');
  }

  dropHandler(_: DragEvent) {

  }

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
        if (this.type === 'to do') {
          return tsk.taskStatus === TaskStatus.Todo
        }
        if (this.type === 'doing') {
          return tsk.taskStatus === TaskStatus.Doing
        }
        if (this.type === 'verify') {
          return tsk.taskStatus === TaskStatus.Verify
        }
        return tsk.taskStatus === TaskStatus.Done
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

// creating stuff

const tskInput = new TaskInputForm();
const toDoTaskList = new TaskList('to do');
const doingTaskList = new TaskList('doing');
const verifyTaskList = new TaskList('verify');
const doneTaskList = new TaskList('done');
