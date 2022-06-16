import { Component, OnInit } from '@angular/core';
import { UsersListService } from 'src/app/users-list.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  maleNumbers: any;
  femaleNumbers: any;

  constructor(private usersData: UsersListService) { }

  ngOnInit(): void {
    this.usersData.selectedCount$.subscribe((value) => {
      this.maleNumbers = value.maleCount;
      this.femaleNumbers = value.femaleCount;
    });
  }

}
