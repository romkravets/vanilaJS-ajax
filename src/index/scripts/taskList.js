import { HTTPServece } from "./http-service";

const BTN_DEL_CLASS_NAME = 'btn_del';
const LIST_ITEM_TEMPLATE = `<li class="list__item" id={{id}}>
      <input type="checkbox" {{checked}}/>
      <span>{{title}}</span>
      <button type="button" class="${BTN_DEL_CLASS_NAME}">DELETE</button>
</li>`

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
         this.renderOne(task);
      });
   }



   deleteItem(taskId) {
      this.httpService.delete(`${URL}/${taskId}`, () => {
         const elementForRemove = this.list.querySelector(`#${TASK_ID_PREFIX + taskId}`);
         this.list.removeChild(elementForRemove);
      });
   }

   renderOne(task) {
      const li = LIST_ITEM_TEMPLATE.replace('{{id}}',  TASK_ID_PREFIX + task.id).replace('{{title}}', task.title);
      this.list.innerHTML = this.list.innerHTML + li;

   }
   
   renderList(tasks) {
      this.list = document.createElement('ul');
      tasks.forEach((task) => this.renderOne(task));

      this.list.addEventListener('click', (e) => {
         if (e.target.classList.contains(BTN_DEL_CLASS_NAME)) {
            e.stopPropagation();
            const id = e.target.closest('li').getAttribute('id').replace(TASK_ID_PREFIX, '');
            this.deleteItem(id);
         }
      })
      this.rootElement.appendChild(this.list);
   }
}