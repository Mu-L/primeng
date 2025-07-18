import { AppCodeModule } from '@/components/doc/app.code.component';
import { AppDocModule } from '@/components/doc/app.doc.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { AccessibilityDoc } from './accessibilitydoc';
import { BasicDoc } from './basicdoc';
import { DisabledDoc } from './disableddoc';
import { ImportDoc } from './importdoc';
import { InvalidDoc } from './invaliddoc';
import { MultipleDoc } from './multipledoc';
import { ReactiveFormsDoc } from './reactiveformsdoc';
import { TemplateDrivenFormsDoc } from './templatedrivenformsdoc';
import { SizesDoc } from './sizesdoc';
import { TemplateDoc } from './templatedoc';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

@NgModule({
    imports: [CommonModule, AppCodeModule, AppDocModule, SelectButton, FormsModule, ReactiveFormsModule, ButtonModule, ToastModule, MessageModule],
    exports: [AppDocModule],
    declarations: [ImportDoc, BasicDoc, MultipleDoc, TemplateDoc, InvalidDoc, SizesDoc, DisabledDoc, AccessibilityDoc, ReactiveFormsDoc, TemplateDrivenFormsDoc]
})
export class SelectButtonDocModule {}
