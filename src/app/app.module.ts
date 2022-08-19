import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MenuComponent } from './components/menu/menu.component';
import { MapComponent } from './components/map/map.component';
import { DesignComponent } from './components/design/design.component';
import { ControlsComponent } from './components/controls/controls.component';
import { PrintingComponent } from './components/printing/printing.component';
import { FormsModule } from '@angular/forms';
import { SharingComponent } from './components/sharing/sharing.component';
import { ColorsComponent } from './components/colors/colors.component';
import { DownloadComponent } from './components/download/download.component';
import { GroupEditorComponent } from './components/group-editor/group-editor.component';
import { LayerEditorComponent } from './components/layer-editor/layer-editor.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component'

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MenuComponent,
    MapComponent,
    DesignComponent,
    ControlsComponent,
    PrintingComponent,
    SharingComponent,
    ColorsComponent,
    DownloadComponent,
    GroupEditorComponent,
    LayerEditorComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
