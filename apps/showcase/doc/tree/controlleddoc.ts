import { Code } from '@/domain/code';
import { NodeService } from '@/service/nodeservice';
import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
    selector: 'controlled-doc',
    standalone: false,
    template: `
        <app-docsectiontext>
            <p>Tree requires a collection of <i>TreeNode</i> instances as a <i>value</i>.</p>
        </app-docsectiontext>
        <div class="card">
            <div class="flex flex-wrap gap-2 mb-6">
                <p-button icon="pi pi-plus" label="Expand all" (click)="expandAll()" />
                <p-button icon="pi pi-minus" label="Collapse all" (click)="collapseAll()" />
            </div>
            <p-tree [value]="files" class="w-full md:w-[30rem]" />
        </div>
        <app-code [code]="code" selector="tree-controlled-demo"></app-code>
    `
})
export class ControlledDoc implements OnInit {
    files!: TreeNode[];

    constructor(private nodeService: NodeService) {}

    ngOnInit() {
        this.nodeService.getFiles().then((data) => (this.files = data));
    }

    expandAll() {
        this.files.forEach((node) => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.files.forEach((node) => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach((childNode) => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    code: Code = {
        basic: `<div class="flex flex-wrap gap-2 mb-6">
    <p-button icon="pi pi-plus" label="Expand all" (click)="expandAll()" />
    <p-button icon="pi pi-minus" label="Collapse all" (click)="collapseAll()" />
</div>
<p-tree [value]="files" class="w-full md:w-[30rem]" />`,

        html: `<div class="card">
    <div class="flex flex-wrap gap-2 mb-6">
        <p-button icon="pi pi-plus" label="Expand all" (click)="expandAll()" />
        <p-button icon="pi pi-minus" label="Collapse all" (click)="collapseAll()" />
    </div>
    <p-tree [value]="files" class="w-full md:w-[30rem]" />
</div>`,

        typescript: `import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { NodeService } from '@/service/nodeservice';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'tree-controlled-demo',
    templateUrl: './tree-controlled-demo.html',
    standalone: true,
    imports: [Tree, ButtonModule],
    providers: [NodeService]
})
export class TreeControlledDemo implements OnInit {
    files!: TreeNode[];

    constructor(private nodeService: NodeService) {}

    ngOnInit() {
        this.nodeService.getFiles().then((data) => (this.files = data));
    }

    expandAll() {
        this.files.forEach((node) => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.files.forEach((node) => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach((childNode) => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }
}`,

        service: ['NodeService'],

        data: `
    /* NodeService */
{
    key: '0',
    label: 'Documents',
    data: 'Documents Folder',
    icon: 'pi pi-fw pi-inbox',
    children: [
        {
            key: '0-0',
            label: 'Work',
            data: 'Work Folder',
            icon: 'pi pi-fw pi-cog',
            children: [
                { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
            ]
        },
        {
            key: '0-1',
            label: 'Home',
            data: 'Home Folder',
            icon: 'pi pi-fw pi-home',
            children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
        }
    ]
},
...`
    };
}
