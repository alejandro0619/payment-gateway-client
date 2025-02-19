import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular'
import { AlertModule } from '@coreui/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LucideAngularModule, AlertModule],
  templateUrl: './app.component.html', 

})
export class AppComponent {

  title = 'client';
}
