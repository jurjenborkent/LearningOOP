"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["Todo"] = 0] = "Todo";
    TaskStatus[TaskStatus["Doing"] = 1] = "Doing";
    TaskStatus[TaskStatus["Verify"] = 2] = "Verify";
    TaskStatus[TaskStatus["Done"] = 3] = "Done";
})(TaskStatus || (TaskStatus = {}));
class Task {
    constructor(id, title, description, points, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.points = points;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class TaskState extends State {
    constructor() {
        super();
        this.tasks = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TaskState();
        return this.instance;
    }
    addTask(title, description, taskPoints) {
        const newTask = new Task(Math.random().toString(), title, description, taskPoints, TaskStatus.Todo);
        this.tasks.push(newTask);
        this.updateListeners();
    }
    moveTask(taskId, newStatus) {
        const task = this.tasks.find(tsk => tsk.id === taskId);
        if (task && task.status !== newStatus) {
            task.status = newStatus;
            this.updateListeners();
        }
    }
    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.tasks.slice());
        }
    }
}
const taskState = TaskState.getInstance();
function validate(validatableInput) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
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
    return isValid;
}
function autoBind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjDecriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDecriptor;
}
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importedHtmlContent = document.importNode(this.templateElement.content, true);
        this.element = importedHtmlContent.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }
}
class TaskItem extends Component {
    constructor(hostId, task) {
        super('single-task', hostId, false, task.id);
        this.task = task;
        this.configure();
        this.renderContent();
    }
    get points() {
        if (this.task.points === 1) {
            return '1 point';
        }
        else {
            return `${this.task.points} points`;
        }
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.task.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(_) {
        console.log('DragEnd');
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.task.title;
        this.element.querySelector('h3').textContent = this.points + ' assigned';
        this.element.querySelector('p').textContent = this.task.description;
    }
}
__decorate([
    autoBind
], TaskItem.prototype, "dragStartHandler", null);
class TaskList extends Component {
    constructor(type) {
        super('tasks-list', 'app', false, `${type}-tasks`);
        this.type = type;
        this.assignedTasks = [];
        this.configure();
        this.renderContent();
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            const listEl = this.element.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dropHandler(event) {
        const tskId = event.dataTransfer.getData('text/plain');
        taskState.moveTask(tskId, this.type === 'todo' ? TaskStatus.Todo : TaskStatus.Doing);
    }
    ;
    dragLeaveHandler(_) {
        const listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        taskState.addListener((tasks) => {
            const relevantTasks = tasks.filter(tsk => {
                if (this.type === 'todo') {
                    return tsk.status === TaskStatus.Todo;
                }
                if (this.type === 'doing') {
                    return tsk.status === TaskStatus.Doing;
                }
                if (this.type === 'verify') {
                    return tsk.status === TaskStatus.Verify;
                }
                return tsk.status === TaskStatus.Doing;
            });
            this.assignedTasks = relevantTasks;
            this.renderTasks();
        });
    }
    renderContent() {
        const listId = `${this.type}-tasks-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase();
    }
    renderTasks() {
        const listEl = document.getElementById(`${this.type}-tasks-list`);
        listEl.innerHTML = '';
        for (const tskItem of this.assignedTasks) {
            new TaskItem(this.element.querySelector('ul').id, tskItem);
        }
    }
}
__decorate([
    autoBind
], TaskList.prototype, "dragOverHandler", null);
__decorate([
    autoBind
], TaskList.prototype, "dragLeaveHandler", null);
class TaskInputForm extends Component {
    constructor() {
        super('task-input', 'app', true, 'user-input');
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.pointsInputElement = this.element.querySelector('#points');
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
    ;
    gatherFormInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPoints = this.pointsInputElement.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true,
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const pointsValidatable = {
            value: +enteredPoints,
            required: true,
            min: 0,
            max: 12
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(pointsValidatable)) {
            alert('Vul het formulier goed in');
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPoints];
        }
    }
    clearForm() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.pointsInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const taskInput = this.gatherFormInput();
        if (Array.isArray(taskInput)) {
            const [title, desc, points] = taskInput;
            taskState.addTask(title, desc, points);
            this.clearForm();
        }
    }
}
__decorate([
    autoBind
], TaskInputForm.prototype, "submitHandler", null);
const tskInput = new TaskInputForm();
const toDoTaskList = new TaskList('todo');
const doingTaskList = new TaskList('doing');
const verifyTaskList = new TaskList('verify');
const doneTaskList = new TaskList('done');
