import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TestComponent } from './test/test.component';
const routes: Routes = [];

@NgModule({
  imports: [ 
    RouterModule.forRoot([
      {path: 'canvas', component: CanvasComponent},
      {path: 'test', component: TestComponent},
      {path: '', redirectTo: '/canvas', pathMatch: 'full'},
      {path: '**', component: PageNotFoundComponent}
    ]),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
