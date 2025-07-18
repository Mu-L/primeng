import { Code } from '@/domain/code';
import { Customer, Representative } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
    selector: 'customers-doc',
    standalone: false,
    template: ` <app-docsectiontext>
            <p>DataTable with selection, pagination, filtering, sorting and templating.</p>
        </app-docsectiontext>
        <p-deferred-demo (load)="loadDemoData()">
            <div class="card">
                <p-table
                    #dt
                    [value]="customers"
                    [(selection)]="selectedCustomers"
                    dataKey="id"
                    [rowHover]="true"
                    [rows]="10"
                    [showCurrentPageReport]="true"
                    [rowsPerPageOptions]="[10, 25, 50]"
                    [loading]="loading"
                    [paginator]="true"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    [filterDelay]="0"
                    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
                >
                    <ng-template #caption>
                        <div class="flex justify-between">
                            <p-button [outlined]="true" icon="pi pi-filter-slash" label="Clear" (click)="clear(dt)" />
                            <p-iconField iconPosition="left">
                                <p-inputIcon>
                                    <i class="pi pi-search"></i>
                                </p-inputIcon>
                                <input pInputText type="text" [(ngModel)]="searchValue" (input)="dt.filterGlobal($event.target.value, 'contains')" placeholder="Keyboard Search" />
                            </p-iconField>
                        </div>
                    </ng-template>
                    <ng-template #header>
                        <tr>
                            <th style="width: 4rem">
                                <p-tableHeaderCheckbox />
                            </th>
                            <th pSortableColumn="name" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Name
                                    <p-sortIcon field="name" />
                                    <p-columnFilter type="text" field="name" display="menu" class="ml-auto" />
                                </div>
                            </th>
                            <th pSortableColumn="country.name" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Country
                                    <p-sortIcon field="country.name" />
                                    <p-columnFilter type="text" field="country.name" display="menu" class="ml-auto" />
                                </div>
                            </th>
                            <th pSortableColumn="representative.name" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Agent
                                    <p-sortIcon field="representative.name" />
                                    <p-columnFilter field="representative" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                                        <ng-template #filter let-value let-filter="filterCallback">
                                            <p-multiselect [filter]="false" [(ngModel)]="value" [options]="representatives" placeholder="Any" (onChange)="filter($event.value)" optionLabel="name" class="w-full">
                                                <ng-template let-option #item>
                                                    <div class="flex items-center gap-2">
                                                        <img [alt]="option.label" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ option.image }}" style="width: 32px" />
                                                        <span>{{ option.name }}</span>
                                                    </div>
                                                </ng-template>
                                            </p-multiselect>
                                        </ng-template>
                                    </p-columnFilter>
                                </div>
                            </th>
                            <th pSortableColumn="date" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Date
                                    <p-sortIcon field="date" />
                                    <p-columnFilter type="date" field="date" display="menu" class="ml-auto" />
                                </div>
                            </th>
                            <th pSortableColumn="balance" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Balance
                                    <p-sortIcon field="balance" />
                                    <p-columnFilter type="numeric" field="balance" display="menu" currency="USD" class="ml-auto" />
                                </div>
                            </th>
                            <th pSortableColumn="status" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Status
                                    <p-sortIcon field="status" />
                                    <p-columnFilter field="status" matchMode="equals" display="menu" class="ml-auto">
                                        <ng-template #filter let-value let-filter="filterCallback">
                                            <p-dropdown [(ngModel)]="value" [options]="statuses" (onChange)="filter($event.value)" placeholder="Any">
                                                <ng-template let-option #item>
                                                    <p-tag [value]="option.label" [severity]="getSeverity(option.label)" />
                                                </ng-template>
                                            </p-dropdown>
                                        </ng-template>
                                    </p-columnFilter>
                                </div>
                            </th>
                            <th pSortableColumn="activity" style="min-width: 14rem">
                                <div class="flex justify-between items-center gap-2">
                                    Activity
                                    <p-sortIcon field="activity" />
                                    <p-columnFilter field="activity" matchMode="between" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                                        <ng-template #filter let-filter="filterCallback">
                                            <p-slider [(ngModel)]="activityValues" [range]="true" (onSlideEnd)="filter($event.values)" class="m-4"></p-slider>
                                            <div class="flex items-center justify-between px-2">
                                                <span>{{ activityValues[0] }}</span>
                                                <span>{{ activityValues[1] }}</span>
                                            </div>
                                        </ng-template>
                                    </p-columnFilter>
                                </div>
                            </th>
                            <th style="width: 5rem"></th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-customer>
                        <tr class="p-selectable-row">
                            <td>
                                <p-tableCheckbox [value]="customer" />
                            </td>
                            <td>
                                {{ customer.name }}
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                                    <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex items-center gap-2">
                                    <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                                    <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                                </div>
                            </td>
                            <td>
                                {{ customer.date | date: 'MM/dd/yyyy' }}
                            </td>
                            <td>
                                {{ customer.balance | currency: 'USD' : 'symbol' }}
                            </td>
                            <td>
                                <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                            </td>
                            <td>
                                <p-progressBar [value]="customer.activity" [showValue]="false" />
                            </td>
                            <td style="text-align: center">
                                <p-button rounded icon="pi pi-cog" />
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template #emptymessage>
                        <tr>
                            <td colspan="8">No customers found.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </p-deferred-demo>
        <app-code [code]="code" selector="table-customers-demo" [extFiles]="extFiles"></app-code>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersDoc {
    customers!: Customer[];

    selectedCustomers!: Customer[];

    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    constructor(
        private customerService: CustomerService,
        private cd: ChangeDetectorRef
    ) {}

    loadDemoData() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

            this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
            this.cd.markForCheck();
        });

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    code: Code = {
        basic: `<p-table
    #dt
    [value]="customers"
    [(selection)]="selectedCustomers"
    dataKey="id"
    [rowHover]="true"
    [rows]="10"
    [showCurrentPageReport]="true"
    [rowsPerPageOptions]="[10, 25, 50]"
    [loading]="loading"
    [paginator]="true"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    [filterDelay]="0"
    [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
>
    <ng-template #caption>
        <div class="flex justify-between">
            <p-button [outlined]="true" icon="pi pi-filter-slash" label="Clear" (click)="clear(dt)" />
            <p-iconField iconPosition="left">
                <p-inputIcon>
                    <i class="pi pi-search"></i>
                </p-inputIcon>
                <input pInputText type="text" [(ngModel)]="searchValue" (input)="dt.filterGlobal($event.target.value, 'contains')" placeholder="Keyboard Search" />
            </p-iconField>
        </div>
    </ng-template>
    <ng-template #header>
        <tr>
            <th style="width: 4rem">
                <p-tableHeaderCheckbox />
            </th>
            <th pSortableColumn="name" style="min-width: 14rem">
                <div class="flex justify-between items-center gap-2">
                    Name
                    <p-sortIcon field="name" />
                    <p-columnFilter type="text" field="name" display="menu" class="ml-auto" />
                </div>
            </th>
            <th pSortableColumn="country.name" style="min-width: 14rem">
                <div class="flex justify-between items-center gap-2">
                    Country
                    <p-sortIcon field="country.name" />
                    <p-columnFilter type="text" field="country.name" display="menu" class="ml-auto" />
                </div>
            </th>
            <th pSortableColumn="representative.name" style="min-width: 14rem">
                <div class="flex justify-between items-center gap-2">
                    Agent
                    <p-sortIcon field="representative.name" />
                    <p-columnFilter field="representative" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                        <ng-template #filter let-value let-filter="filterCallback">
                            <p-multiselect [filter]="false" [(ngModel)]="value" [options]="representatives" placeholder="Any" (onChange)="filter($event.value)" optionLabel="name" class="w-full">
                                <ng-template let-option #item>
                                    <div class="flex items-center gap-2">
                                        <img [alt]="option.label" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ option.image }}" style="width: 32px" />
                                        <span>{{ option.name }}</span>
                                    </div>
                                </ng-template>
                            </p-multiselect>
                        </ng-template>
                    </p-columnFilter>
                </div>
            </th>
            <th pSortableColumn="date" style="min-width: 14rem">
                <div class="flex justify-between items-center gap-2">
                    Date
                    <p-sortIcon field="date" />
                    <p-columnFilter type="date" field="date" display="menu" class="ml-auto" />
                </div>
            </th>
            <th pSortableColumn="balance" style="min-width: 14rem">
                <div class="flex justify-between items-center gap-2">
                    Balance
                    <p-sortIcon field="balance" />
                    <p-columnFilter type="numeric" field="balance" display="menu" currency="USD" class="ml-auto" />
                </div>
            </th>
            <th pSortableColumn="status" style="min-width: 14rem">
                <div class="flex justify-between items-center gap-2">
                    Status
                    <p-sortIcon field="status" />
                    <p-columnFilter field="status" matchMode="equals" display="menu" class="ml-auto">
                        <ng-template #filter let-value let-filter="filterCallback">
                            <p-dropdown [(ngModel)]="value" [options]="statuses" (onChange)="filter($event.value)" placeholder="Any">
                                <ng-template let-option #item>
                                    <p-tag [value]="option.label" [severity]="getSeverity(option.label)" />
                                </ng-template>
                            </p-dropdown>
                        </ng-template>
                    </p-columnFilter>
                </div>
            </th>
            <th pSortableColumn="activity" style="min-width: 14rem">
                <div class="flex justify-between items-center gap-2">
                    Activity
                    <p-sortIcon field="activity" />
                    <p-columnFilter field="activity" matchMode="between" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                        <ng-template #filter let-filter="filterCallback">
                            <p-slider [(ngModel)]="activityValues" [range]="true" (onSlideEnd)="filter($event.values)" class="m-4"></p-slider>
                            <div class="flex items-center justify-between px-2">
                                <span>{{ activityValues[0] }}</span>
                                <span>{{ activityValues[1] }}</span>
                            </div>
                        </ng-template>
                    </p-columnFilter>
                </div>
            </th>
            <th style="width: 5rem"></th>
        </tr>
    </ng-template>
    <ng-template #body let-customer>
        <tr class="p-selectable-row">
            <td>
                <p-tableCheckbox [value]="customer" />
            </td>
            <td>
                {{ customer.name }}
            </td>
            <td>
                <div class="flex items-center gap-2">
                    <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                    <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                </div>
            </td>
            <td>
                <div class="flex items-center gap-2">
                    <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                    <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                </div>
            </td>
            <td>
                {{ customer.date | date: 'MM/dd/yyyy' }}
            </td>
            <td>
                {{ customer.balance | currency: 'USD' : 'symbol' }}
            </td>
            <td>
                <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
            </td>
            <td>
                <p-progressBar [value]="customer.activity" [showValue]="false" />
            </td>
            <td style="text-align: center">
                <p-button rounded icon="pi pi-cog" />
            </td>
        </tr>
    </ng-template>
    <ng-template #emptymessage>
        <tr>
            <td colspan="8">No customers found.</td>
        </tr>
    </ng-template>
</p-table>`,
        html: `<div class="card">
    <p-table
        #dt
        [value]="customers"
        [(selection)]="selectedCustomers"
        dataKey="id"
        [rowHover]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        [rowsPerPageOptions]="[10, 25, 50]"
        [loading]="loading"
        [paginator]="true"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [filterDelay]="0"
        [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
    >
        <ng-template #caption>
            <div class="flex justify-between">
                <p-button [outlined]="true" icon="pi pi-filter-slash" label="Clear" (click)="clear(dt)" />
                <p-iconField iconPosition="left">
                    <p-inputIcon>
                        <i class="pi pi-search"></i>
                    </p-inputIcon>
                    <input pInputText type="text" [(ngModel)]="searchValue" (input)="dt.filterGlobal($event.target.value, 'contains')" placeholder="Keyboard Search" />
                </p-iconField>
            </div>
        </ng-template>
        <ng-template #header>
            <tr>
                <th style="width: 4rem">
                    <p-tableHeaderCheckbox />
                </th>
                <th pSortableColumn="name" style="min-width: 14rem">
                    <div class="flex justify-between items-center gap-2">
                        Name
                        <p-sortIcon field="name" />
                        <p-columnFilter type="text" field="name" display="menu" class="ml-auto" />
                    </div>
                </th>
                <th pSortableColumn="country.name" style="min-width: 14rem">
                    <div class="flex justify-between items-center gap-2">
                        Country
                        <p-sortIcon field="country.name" />
                        <p-columnFilter type="text" field="country.name" display="menu" class="ml-auto" />
                    </div>
                </th>
                <th pSortableColumn="representative.name" style="min-width: 14rem">
                    <div class="flex justify-between items-center gap-2">
                        Agent
                        <p-sortIcon field="representative.name" />
                        <p-columnFilter field="representative" matchMode="in" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-multiselect [filter]="false" [(ngModel)]="value" [options]="representatives" placeholder="Any" (onChange)="filter($event.value)" optionLabel="name" class="w-full">
                                    <ng-template let-option #item>
                                        <div class="flex items-center gap-2">
                                            <img [alt]="option.label" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ option.image }}" style="width: 32px" />
                                            <span>{{ option.name }}</span>
                                        </div>
                                    </ng-template>
                                </p-multiselect>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th pSortableColumn="date" style="min-width: 14rem">
                    <div class="flex justify-between items-center gap-2">
                        Date
                        <p-sortIcon field="date" />
                        <p-columnFilter type="date" field="date" display="menu" class="ml-auto" />
                    </div>
                </th>
                <th pSortableColumn="balance" style="min-width: 14rem">
                    <div class="flex justify-between items-center gap-2">
                        Balance
                        <p-sortIcon field="balance" />
                        <p-columnFilter type="numeric" field="balance" display="menu" currency="USD" class="ml-auto" />
                    </div>
                </th>
                <th pSortableColumn="status" style="min-width: 14rem">
                    <div class="flex justify-between items-center gap-2">
                        Status
                        <p-sortIcon field="status" />
                        <p-columnFilter field="status" matchMode="equals" display="menu" class="ml-auto">
                            <ng-template #filter let-value let-filter="filterCallback">
                                <p-dropdown [(ngModel)]="value" [options]="statuses" (onChange)="filter($event.value)" placeholder="Any">
                                    <ng-template let-option #item>
                                        <p-tag [value]="option.label" [severity]="getSeverity(option.label)" />
                                    </ng-template>
                                </p-dropdown>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th pSortableColumn="activity" style="min-width: 14rem">
                    <div class="flex justify-between items-center gap-2">
                        Activity
                        <p-sortIcon field="activity" />
                        <p-columnFilter field="activity" matchMode="between" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false" class="ml-auto">
                            <ng-template #filter let-filter="filterCallback">
                                <p-slider [(ngModel)]="activityValues" [range]="true" (onSlideEnd)="filter($event.values)" class="m-4"></p-slider>
                                <div class="flex items-center justify-between px-2">
                                    <span>{{ activityValues[0] }}</span>
                                    <span>{{ activityValues[1] }}</span>
                                </div>
                            </ng-template>
                        </p-columnFilter>
                    </div>
                </th>
                <th style="width: 5rem"></th>
            </tr>
        </ng-template>
        <ng-template #body let-customer>
            <tr class="p-selectable-row">
                <td>
                    <p-tableCheckbox [value]="customer" />
                </td>
                <td>
                    {{ customer.name }}
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" style="width: 20px" />
                        <span class="ml-1 align-middle">{{ customer.country.name }}</span>
                    </div>
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <img [alt]="customer.representative.name" src="https://primefaces.org/cdn/primeng/images/demo/avatar/{{ customer.representative.image }}" width="32" style="vertical-align: middle" />
                        <span class="ml-1 align-middle">{{ customer.representative.name }}</span>
                    </div>
                </td>
                <td>
                    {{ customer.date | date: 'MM/dd/yyyy' }}
                </td>
                <td>
                    {{ customer.balance | currency: 'USD' : 'symbol' }}
                </td>
                <td>
                    <p-tag [value]="customer.status" [severity]="getSeverity(customer.status)" />
                </td>
                <td>
                    <p-progressBar [value]="customer.activity" [showValue]="false" />
                </td>
                <td style="text-align: center">
                    <p-button rounded icon="pi pi-cog" />
                </td>
            </tr>
        </ng-template>
        <ng-template #emptymessage>
            <tr>
                <td colspan="8">No customers found.</td>
            </tr>
        </ng-template>
    </p-table>
</div>`,
        typescript: `import { Component, OnInit } from '@angular/core';
import { Customer, Representative } from '@/domain/customer';
import { CustomerService } from '@/service/customerservice';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Slider } from 'primeng/slider';
import { ProgressBar } from 'primeng/progressbar';

@Component({
    selector: 'table-customers-demo',
    templateUrl: 'table-customers-demo.html',
    standalone: true,
    imports: [TableModule, Tag, ButtonModule,IconField, InputIcon, HttpClientModule,
    CommonModule, MultiSelectModule, InputTextModule, DropdownModule, Slider, ProgressBar ],
    providers: [CustomerService],
    styles: [
    \`
    :host ::ng-deep {
        .p-paginator {
            .p-paginator-current {
                margin-left: auto;
            }
        }

        .p-progressbar {
            height: .5rem;
            background-color: #D8DADC;

            .p-progressbar-value {
                background-color: #607D8B;
            }
        }

        .table-header {
            display: flex;
            justify-content: space-between;
        }

        .p-calendar .p-datepicker {
            min-width: 25rem;

            td {
                font-weight: 400;
            }
        }

        .p-datatable.p-datatable-customers {
            .p-datatable-header {
                padding: 1rem;
                text-align: left;
                font-size: 1.5rem;
            }

            .p-paginator {
                padding: 1rem;
            }

            .p-datatable-thead > tr > th {
                text-align: left;
            }

            .p-datatable-tbody > tr > td {
                cursor: auto;
            }

            .p-dropdown-label:not(.p-placeholder) {
                text-transform: uppercase;
            }
        }

        .p-w-100 {
            width: 100%;
        }

        /* Responsive */
        .p-datatable-customers .p-datatable-tbody > tr > td .p-column-title {
            display: none;
        }
    }

    @media screen and (max-width: 960px) {
        :host ::ng-deep {
            .p-datatable {
                &.p-datatable-customers {
                    .p-datatable-thead > tr > th,
                    .p-datatable-tfoot > tr > td {
                        display: none !important;
                    }

                    .p-datatable-tbody > tr {
                        border-bottom: 1px solid var(--layer-2);

                        > td {
                            text-align: left;
                            width: 100%;
                            display: flex;
                            align-items: center;
                            border: 0 none;

                            .p-column-title {
                                min-width: 30%;
                                display: inline-block;
                                font-weight: bold;
                            }

                            p-progressbar {
                                width: 100%;
                            }

                            &:last-child {
                                border-bottom: 1px solid var(--surface-d);
                            }
                        }
                    }
                }
            }
        }
    }
    \`
    ],
})
export class TableCustomersDemo implements OnInit{
    customers!: Customer[];

    selectedCustomers!: Customer[];

    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

            this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
        });

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }
}`,
        data: `{
    id: 1000,
    name: 'James Butt',
    country: {
        name: 'Algeria',
        code: 'dz'
    },
    company: 'Benton, John B Jr',
    date: '2015-09-13',
    status: 'unqualified',
    verified: true,
    activity: 17,
    representative: {
        name: 'Ioni Bowcher',
        image: 'ionibowcher.png'
    },
    balance: 70663
},
...`,

        service: ['CustomerService']
    };

    clear(dt: Table) {
        this.searchValue = '';
        dt.reset();
    }

    getSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warn';

            case 'renewal':
                return null;
        }
    }

    extFiles = [
        {
            path: 'src/domain/customer.ts',
            content: `
export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: string | Date;
    status?: string;
    activity?: number;
    representative?: Representative;
    verified?: boolean;
    balance?: number;
}`
        }
    ];
}
