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
    constructor(id, title, description, points, taskStatus) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.points = points;
        this.taskStatus = taskStatus;
    }
}
class TaskState {
    constructor() {
        this.tasks = [];
        this.listeners = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new TaskState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addTask(title, description, taskPoints) {
        const newTask = new Task(Math.random().toString(), title, description, taskPoints, TaskStatus.Todo);
        this.tasks.push(newTask);
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
class TaskInputForm {
    constructor() {
        this.templateElement = document.getElementById('task-input');
        this.hostElement = document.getElementById('app');
        const importedHtmlContent = document.importNode(this.templateElement.content, true);
        this.element = importedHtmlContent.firstElementChild;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.pointsInputElement = this.element.querySelector('#points');
        this.configure();
        this.attach();
    }
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
            min: 1,
            max: 5
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
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
__decorate([
    autoBind
], TaskInputForm.prototype, "submitHandler", null);
class TaskList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById('tasks-list');
        this.hostElement = document.getElementById('app');
        this.assignedTasks = [];
        const importedHtmlContent = document.importNode(this.templateElement.content, true);
        this.element = importedHtmlContent.firstElementChild;
        this.element.id = `${type}-tasks`;
        taskState.addListener((tasks) => {
            const relevantTasks = tasks.filter(tsk => {
                if (this.type === 'to do') {
                    return tsk.taskStatus === TaskStatus.Todo;
                }
                if (this.type === 'doing') {
                    return tsk.taskStatus === TaskStatus.Doing;
                }
                if (this.type === 'verify') {
                    return tsk.taskStatus === TaskStatus.Verify;
                }
                return tsk.taskStatus === TaskStatus.Done;
            });
            this.assignedTasks = relevantTasks;
            this.renderTasks();
        });
        this.attach();
        this.renderContent();
    }
    renderTasks() {
        const listEl = document.getElementById(`${this.type}-tasks-list`);
        listEl.innerHTML = '';
        for (const tskItem of this.assignedTasks) {
            const listItem = document.createElement('li');
            listItem.textContent = tskItem.title;
            listEl.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-tasks-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase();
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}
const prjInput = new TaskInputForm();
const toDoTaskList = new TaskList('to do');
const doingTaskList = new TaskList('doing');
const verifyTaskList = new TaskList('verify');
const doneTaskList = new TaskList('done');
