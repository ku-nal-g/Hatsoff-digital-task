import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UsersListService } from 'src/app/users-list.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { isNgTemplate } from '@angular/compiler';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  displayedColumns: string[] = ['Select', 'Name', 'Email', 'Gender', 'Address', 'Date Of Birth', 'Buttons'];
  dataSource: any = [];
  clickedRows = new Set<any>();
  usersList: any;
  toDisabled = false;
  selection = new SelectionModel<any>(true, []);
  name: string = '';
  data: any = [];
  deleteIndex = -1;
  arr: any = [];
  editIndex = -1;
  maleUsers = 0;
  femaleUsers = 0;
  maxDate: any;

  constructor(private usersData: UsersListService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.usersData.getUsersList().subscribe((res) => {
      this.arr = res;
      this.dataSource = new MatTableDataSource<any>(this.arr);
      this.dataSource.paginator = this.paginator;
      this.getMaleFemaleCount(this.arr);
      let count = {
        'maleCount': this.maleUsers,
        'femaleCount': this.femaleUsers,
      }
      this.usersData.setProduct(count);
    });
    //restricts user to choose future date
    let today = new Date()
    let d = today.toISOString().split('T')[0];
    this.maxDate = d;
  }

  userInfo = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    gender: new FormControl(1, [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });

  get userName() {
    return this.userInfo.get('name');
  }
  get email() {
    return this.userInfo.get('email');
  }
  get gender() {
    return this.userInfo.get('gender');
  }
  get dob() {
    return this.userInfo.get('dob');
  }
  get address() {
    return this.userInfo.get('address');
  }

  getMaleFemaleCount(userList: any) {
    let male = 0;
    let female = 0;
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].gender == 'Male') {
        male++;
      }
      else if (userList[i].gender == 'Female') {
        female++;
      }
    }
    this.maleUsers = male;
    this.femaleUsers = female;
  }

  isDisabled() {
    this.toDisabled = true;
  }

  disable() {
    this.toDisabled = false;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSelectedPage() {
    const numSelected = this.selection.selected.length;
    const page = this.dataSource.paginator.pageSize;
    let endIndex: number;
    if (
      this.dataSource.data.length >
      (this.dataSource.paginator.pageIndex + 1) *
      this.dataSource.paginator.pageSize
    ) {
      endIndex =
        (this.dataSource.paginator.pageIndex + 1) *
        this.dataSource.paginator.pageSize;
    } else {
      endIndex =
        this.dataSource.data.length -
        this.dataSource.paginator.pageIndex *
        this.dataSource.paginator.pageSize;
    }
    return numSelected === endIndex;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }
  selectRows() {
    let endIndex: number;
    if (
      this.dataSource.data.length >
      (this.dataSource.paginator.pageIndex + 1) *
      this.dataSource.paginator.pageSize
    ) {
      endIndex =
        (this.dataSource.paginator.pageIndex + 1) *
        this.dataSource.paginator.pageSize;
    } else {
      endIndex = this.dataSource.data.length;
    }

    for (
      let index =
        this.dataSource.paginator.pageIndex *
        this.dataSource.paginator.pageSize;
      index < endIndex;
      index++
    ) {
      this.selection.select(this.dataSource.data[index]);
    }
  }

  logUser(item: any) {
    this.deleteIndex = item.id;
    this.name = item.name;
  }

  //deletes row

  deleteRow(id: any) {
    let deleteId = id + '';
    this.usersData.deleteUser(deleteId).subscribe((res)=>{
      window.location.reload();
    })
    this.dataSource = new MatTableDataSource<any>(this.arr);
    this.dataSource.paginator = this.paginator;
    this.getMaleFemaleCount(this.arr);
    let count = {
      'maleCount': this.maleUsers,
      'femaleCount': this.femaleUsers,
    }
    this.usersData.setProduct(count)
  }
  editUser(item: any) {
    this.editIndex = item.id;
  }

  updateRowData(id: any) {
    let idChoosen = id + '';
    this.updateArray(idChoosen);
    this.userInfo.reset();
  }
  updateArray(idChoosen: any) {
    let reqObj = {
      name: this.userInfo.value.name,
      address: this.userInfo.value.address,
      email: this.userInfo.value.email,
      gender: (this.userInfo.value.gender == 1) ? 'Male' : 'Female',
      dob: this.userInfo.value.dob
    }
    this.usersData.putUsersList(idChoosen,reqObj).subscribe((res)=>{
      window.location.reload();
    })
    this.dataSource = new MatTableDataSource<any>(this.arr);
    this.dataSource.paginator = this.paginator;
    this.getMaleFemaleCount(this.arr);
    let count = {
      'maleCount': this.maleUsers,
      'femaleCount': this.femaleUsers,
    }
    this.usersData.setProduct(count)
  }

  // used to query and get the reference of DOM element

  @ViewChild(MatPaginator) paginator!: MatPaginator;

}
