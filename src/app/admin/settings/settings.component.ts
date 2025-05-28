import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenu } from "../../ui/navs/main-menu.component";

@Component({
  selector: 'app-settings',
  imports: [CommonModule, MainMenu],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {}
