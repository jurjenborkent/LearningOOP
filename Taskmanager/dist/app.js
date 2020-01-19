"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
            console.log(title, desc, points);
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
        const importedHtmlContent = document.importNode(this.templateElement.content, true);
        this.element = importedHtmlContent.firstElementChild;
        this.element.id = `${type}-tasks`;
        this.attach();
        this.renderContent();
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
const activatePrjList = new TaskList('active');
const finishedPrjList = new TaskList('finished');
