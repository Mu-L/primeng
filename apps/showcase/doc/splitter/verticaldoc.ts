import { Code } from '@/domain/code';
import { Component } from '@angular/core';

@Component({
    selector: 'vertical-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>Panels are displayed as stacked by setting the <i>layout</i> to <i>vertical</i>.</p>
        </app-docsectiontext>
        <div class="card">
            <p-splitter [style]="{ height: '300px' }" class="mb-8" [panelSizes]="[50, 50]" layout="vertical">
                <ng-template #panel>
                    <div class="flex items-center justify-center h-full">Panel 1</div>
                </ng-template>
                <ng-template #panel>
                    <div class="flex items-center justify-center h-full">Panel 2</div>
                </ng-template>
            </p-splitter>
        </div>
        <app-code [code]="code" selector="splitter-vertical-demo"></app-code>
    `
})
export class VerticalDoc {
    code: Code = {
        basic: `<p-splitter [style]="{ height: '300px' }" class="mb-8" layout="vertical">
    <ng-template #panel>
        <div class="flex items-center justify-center h-full">Panel 1</div>
    </ng-template>
    <ng-template #panel>
        <div class="flex items-center justify-center h-full">Panel 2</div>
    </ng-template>
</p-splitter>`,

        html: `<div class="card">
    <p-splitter [style]="{ height: '300px' }" class="mb-8" layout="vertical">
        <ng-template #panel>
            <div class="flex items-center justify-center h-full">Panel 1</div>
        </ng-template>
        <ng-template #panel>
            <div class="flex items-center justify-center h-full">Panel 2</div>
        </ng-template>
    </p-splitter>
</div>`,

        typescript: `import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';

@Component({
    selector: 'splitter-vertical-demo',
    templateUrl: './splitter-vertical-demo.html',
    standalone: true,
    imports: [SplitterModule]
})
export class SplitterVerticalDemo {}`
    };
}
