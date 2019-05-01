import { HTTPServece } from "./http-service";

const LIST_ITEM_TEMPLATE = `<li class="list__item" id={{id}}>
      <input type="checkbox" {{checked}}/>
      <span>{{title}}</span>

</li>`

const URL = 'https://evening-dawn-11092.herokuapp.com/list';

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

   renderOne(task) {
      const li = LIST_ITEM_TEMPLATE.replace('{{id}}', task.id).replace('{{title}}', task.title);
      this.list.innerHTML = this.list.innerHTML + li;

   }
   
   renderList(tasks) {
      this.list = document.createElement('ul');
      tasks.forEach((task) => this.renderOne(task));

      this.rootElement.appendChild(this.list);
   }
}