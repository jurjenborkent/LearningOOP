/// <reference path="models/drag-drop.ts" />
/// <reference path="models/task.ts" />
/// <reference path="state/task-state.ts"  />
/// <reference path="val/validator.ts"  />
/// <reference path="decorators/autobind.ts"  />
/// <reference path="components/task-input.ts"  />
/// <reference path="components/task-list.ts"  />

namespace App {
// creating stuff
new TaskInputForm();
new TaskList('todo');
new TaskList('doing');
new TaskList('verify');
new TaskList('done');

}