import { Component } from '@angular/core';
import { TaskService } from './services/task.service';
import { Modal } from 'bootstrap';

interface Task {
  id?:string;
  titulo: string;
  descripcion: string;
  fecha_vencimiento: string;
  status: boolean;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})



export class TaskComponent {

msg:string = ''
tasks:any[] =[]
model2:any = {}
hideUpdate:boolean =true

  nuevaTarea: Task = {
    titulo: '',
    descripcion: '',
    fecha_vencimiento: '',
    status: false
  };

  constructor(readonly taskService: TaskService) { }
  ngOnInit() {
    this.getTasks();
  }

  addTask(taskForm: any):void{
     if (!this.nuevaTarea.titulo || !this.nuevaTarea.descripcion || !this.nuevaTarea.fecha_vencimiento) {
      alert('Todos los campos son obligatorios.');
       return;
     }

     this.taskService.createTask(this.nuevaTarea).subscribe({
       next: (response) => {
         alert('Tarea guardada correctamente.');
         this.tasks.push(response);
         this.limpiarFormulario(taskForm);
         this.cerrarModal()

       },
       error: (err) => {
         console.error('Error al crear tarea:', err);
         alert('Hubo un error al crear la tarea');
       }
     });
 }

  cerrarModal() {
    const modalElement = document.getElementById('TaskModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
  }

  limpiarFormulario(taskForm?: any) {
    if (taskForm) {
      taskForm.resetForm();
    }

    this.nuevaTarea = {
      titulo: '',
      descripcion: '',
      fecha_vencimiento: '',
      status: false
    };
  }

 getTasks() {

    return this.taskService.getTask().subscribe({
      next: (data) => {
        this.tasks = data;
        console.log('Datos recibidos:', data);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

 deleteTask(id:any):void{
   if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
     this.taskService.deleteTask(id).subscribe({
       next: () => {
         console.log('Tarea eliminada con éxito');
         this.tasks = this.tasks.filter(task => task.id !== id); // Actualiza la lista sin recargar
       },
       error: (error) => {
         console.error('Error al eliminar la tarea:', error);
       }
     });
   }
 }

myValue:any;
 editTask(task:any):void{
this.hideUpdate =false
this.model2.titulo       = task.titulo
this.model2.descripcion = task.descripcion
this.model2.fecha_vencimiento    = task.fecha_vencimiento
this.model2.status = task.status
this.myValue = task.id

 }

 updatedTask(task:any):void {

  const updatedModel2 = {
    ...task
  }
  console.log('hhh', this.myValue)
  console.log('estado', updatedModel2.status)

   this.taskService.updateTask(this.myValue, updatedModel2).subscribe({
     next: (response) => {

       this.limpiarFormulario();
       this.getTasks()
       this.hideUpdate = true
     },
     error: (err) => {
       console.error('Error al crear tarea:', err);
       this.msg = 'Hubo un error al crear la tarea.';
     }
   })
  }


  toggleStatus(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.model2.status = checked;
    console.log('Estado actualizado:', this.model2.status);
  }

}
