"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let logged;
function sendAnalytics(data) {
    console.log(data);
    logged = true;
}
sendAnalytics('The data');
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
var App;
(function (App) {
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
        updateListeners() {
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
        addTask(title, description, taskPoints) {
            const newTask = new App.Task(Math.random().toString(), title, description, taskPoints, App.TaskStatus.Todo);
            this.tasks.push(newTask);
            this.updateListeners();
        }
        moveTask(taskId, newStatus) {
            const task = this.tasks.find(tsk => tsk.id === taskId);
            if (task && task.status !== newStatus) {
                task.status = newStatus;
                this.updateListeners();
                console.log(task);
            }
        }
    }
    App.TaskState = TaskState;
    App.taskState = TaskState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
    App.validate = validate;
})(App || (App = {}));
var App;
(function (App) {
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
    App.autoBind = autoBind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    class TaskInputForm extends App.Component {
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
            if (!App.validate(titleValidatable) ||
                !App.validate(descriptionValidatable) ||
                !App.validate(pointsValidatable)) {
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
                App.taskState.addTask(title, desc, points);
                this.clearForm();
            }
        }
    }
    __decorate([
        App.autoBind
    ], TaskInputForm.prototype, "submitHandler", null);
    App.TaskInputForm = TaskInputForm;
})(App || (App = {}));
var App;
(function (App) {
    class TaskList extends App.Component {
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
            var _a;
            const targetId = (_a = event.target.parentElement) === null || _a === void 0 ? void 0 : _a.id;
            if (!targetId) {
                return;
            }
            const taskID = event.dataTransfer.getData('text/plain');
            switch (targetId) {
                case App.TaskDrops.Todo:
                    App.taskState.moveTask(taskID, App.TaskStatus.Todo);
                    break;
                case App.TaskDrops.Doing:
                    App.taskState.moveTask(taskID, App.TaskStatus.Doing);
                    break;
                case App.TaskDrops.Verify:
                    App.taskState.moveTask(taskID, App.TaskStatus.Verify);
                    break;
                case App.TaskDrops.Done:
                    App.taskState.moveTask(taskID, App.TaskStatus.Done);
                    break;
                default:
                    break;
            }
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
            App.taskState.addListener((tasks) => {
                const relevantTasks = tasks.filter(tsk => {
                    if (this.type === 'todo') {
                        return tsk.status === App.TaskStatus.Todo;
                    }
                    if (this.type === 'doing') {
                        return tsk.status === App.TaskStatus.Doing;
                    }
                    if (this.type === 'verify') {
                        return tsk.status === App.TaskStatus.Verify;
                    }
                    return tsk.status === App.TaskStatus.Done;
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
                new App.TaskItem(this.element.querySelector('ul').id, tskItem);
            }
        }
    }
    __decorate([
        App.autoBind
    ], TaskList.prototype, "dragOverHandler", null);
    __decorate([
        App.autoBind
    ], TaskList.prototype, "dropHandler", null);
    __decorate([
        App.autoBind
    ], TaskList.prototype, "dragLeaveHandler", null);
    App.TaskList = TaskList;
})(App || (App = {}));
var App;
(function (App) {
    new App.TaskInputForm();
    new App.TaskList('todo');
    new App.TaskList('doing');
    new App.TaskList('verify');
    new App.TaskList('done');
})(App || (App = {}));
var App;
(function (App) {
    class TaskItem extends App.Component {
        constructor(hostId, task) {
            super('single-task', hostId, false, task.id);
            this.task = task;
            console.log(task);
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
            console.log(this.task);
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
        App.autoBind
    ], TaskItem.prototype, "dragStartHandler", null);
    App.TaskItem = TaskItem;
})(App || (App = {}));
