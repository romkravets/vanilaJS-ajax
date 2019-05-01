import { HTTPServece } from "./http-service";

const BTN_DEL_CLASS_NAME = 'btn_del';
const CHECKBOX_CLASS_NAME = 'list__checkbox'
const TITLE_ATT = 'title';
const LIST_ITEM_TEMPLATE = `
      <input type="checkbox" {{isChecked}} class="${CHECKBOX_CLASS_NAME}"/>
      <span data-name="${TITLE_ATT}">{{title}}</span>
      <button type="button" class="${BTN_DEL_CLASS_NAME}">DELETE</button>
`

const URL = 'https://evening-dawn-11092.herokuapp.com/list';
const TASK_ID_PREFIX = 'taskID';

export class TaskList {
   constructor(rootElement) {
      this.rootElement = rootElement;
      this.httpService = new HTTPServece();
      this.render();
      this.getList();
   }

   getList() {
      this.httpService.get(URL, (response) => this.renderList(response));
   }

   render() {
      this.form = document.createElement('form');
      this.input = document.createElement('input');
      this.submitBtn = document.createElement('button');

      this.submitBtn.textContent = "Add";
      this.form.appendChild(this.input);
      this.form.appendChild(this.submitBtn);
      this.form.addEventListener('submit', (e) => this.onSubmit(e));

      this.rootElement.appendChild(this.form);
   }

   onSubmit(e) {
      e.preventDefault();
      const title = this.input.value;
      this.input.value = '';

      this.httpService.post(URL, {title}, (task) => {
         this.list.appendChild(this.renderOne(task));
      });
   }

   updateItem(taskId) {
      const replaceElement = this.list.querySelector(`#${TASK_ID_PREFIX + taskId}`);
      const id = taskId;
      const title = replaceElement.querySelector( `[data-name*=${TITLE_ATT}]`).textContent;
      const completed = replaceElement.querySelector(`.${CHECKBOX_CLASS_NAME}`).getAttribute('checked') ?  false : true;

      this.httpService.put(`${URL}/${taskId}`, {id, title, completed}, (task) => {
         const updeteTask = this.renderOne(task);
         
         this.list.replaceChild(updeteTask, replaceElement);
      });
   }

   deleteItem(taskId) {
      this.httpService.delete(`${URL}/${taskId}`, () => {
         const elementForRemove = this.list.querySelector(`#${TASK_ID_PREFIX + taskId}`);
         this.list.removeChild(elementForRemove);
      });
   }

   renderOne(task) {
      const li = document.createElement('li');
      li.id = TASK_ID_PREFIX + task.id;
      li.innerHTML = LIST_ITEM_TEMPLATE
      .replace('{{id}}',  TASK_ID_PREFIX + task.id)
      .replace('{{title}}', task.title)
      .replace(`{{isChecked}}`, task.completed ? 'checked' : '');

      return li;
   }

   renderList(tasks) {
      this.list = document.createElement('ul');
      const fragment = document.createDocumentFragment();
      tasks.forEach((task) => {
         fragment.appendChild(this.renderOne(task));
      });

      this.list.appendChild(fragment);

      this.list.addEventListener('click', (e) => {
         if (e.target.classList.contains(BTN_DEL_CLASS_NAME)) {
            e.stopPropagation();
            const id = e.target.closest('li').getAttribute('id').replace(TASK_ID_PREFIX, '');
            this.deleteItem(id);
         }
         if (e.target.classList.contains(CHECKBOX_CLASS_NAME)) {
            const id = e.target.closest('li').getAttribute('id').replace(TASK_ID_PREFIX, '');
            this.updateItem(id);
         }
      })
      this.rootElement.appendChild(this.list);
   }
}