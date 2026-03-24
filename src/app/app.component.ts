import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ComponentExampleComponent } from './component-example/component-example.component';
import { CustomAnimationComponent } from './custom-animation/custom-animation.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { InstallationComponent } from './installation/installation.component';
import { OverviewComponent } from './overview/overview.component';
import { SimpleExampleComponent } from './simple-example/simple-example.component';
import { TemplateExampleComponent } from './template-example/template-example.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    InstallationComponent,
    FooterComponent,
    OverviewComponent,
    SimpleExampleComponent,
    ComponentExampleComponent,
    TemplateExampleComponent,
    CustomAnimationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
