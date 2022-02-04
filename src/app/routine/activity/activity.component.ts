import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router'

import { Activity } from 'src/app/shared/models/Activity'
import { Actions } from 'src/app/shared/Actions'

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  @Input() activity?: Activity
  @Output() deleteEvent = new EventEmitter<string>()
  @Output() updateEvent = new EventEmitter<Activity>()
  @Output() addEvent = new EventEmitter<Activity>()
  currentAction = ''

  private readonly actionControl = new BehaviorSubject(Actions.VIEW)
  activityForm = this.fb.group({
    id: [''],
    icon: ['', Validators.required],
    title: [''],
    startTime: ['12:00'],
    durationTime: ['00:05']
  })

  constructor (private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router) { }

  ngOnInit (): void {
    if (this.activity !== undefined && this.activity.id !== '') {
      this.setData(this.activity)
    } else {
      this.actionControl.next(Actions.NEW)
    }
    this.actionControl.subscribe(action => {
      this.currentAction = action
    })
  }

  setData (activity: Activity): void {
    // TODO: Validaciones
    this.activityForm.patchValue({
      id: activity.id,
      icon: activity.icon,
      title: activity.title,
      startTime: activity.startTime,
      durationTime: activity.durationTime
    })
  }

  save (): any {
    // TODO: validar que en realida algo cambio
    const activity = new Activity(
      this.activityForm.value.id,
      this.activityForm.value.icon,
      this.activityForm.value.title,
      this.activityForm.value.startTime,
      this.activityForm.value.durationTime
    )
    if (this.currentAction === Actions.EDIT) {
      this.updateEvent.emit(activity)
    }
    if (this.currentAction === Actions.NEW) {
      this.addEvent.emit(activity)
    }
    this.actionControl.next(Actions.VIEW)
  }

  cancel (): void {
    if (this.currentAction === Actions.EDIT) {
      if (this.activity !== undefined) {
        this.setData(this.activity)
      }
    }
    if (this.currentAction === Actions.NEW) {
      // TODO: Redirigir a pantalla principal
      this.close()
    }
    this.actionControl.next(Actions.VIEW)
  }

  edit (): void {
    this.actionControl.next(Actions.EDIT)
  }

  delete (): void {
    this.deleteEvent.emit(this.activity?.id)
    this.close() // TODO: esperar respuesta de confirmación
    // TODO: Alerta de confirmación para eliminar
  }

  close (): void {
    // TODO: sacar a componente local-activity
    void this.router.navigate(['local'])
  }
}
