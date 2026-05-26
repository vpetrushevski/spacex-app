import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageObject } from '../../core/models/shared.model';
import { Settings } from '../shared/settings/settings';
import { Header } from '../../theme/components/header/header';
import { SharedService } from '../../core/services/shared.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-launch',
  imports: [Header, RouterOutlet],
  templateUrl: './launch.html',
  styleUrl: './launch.scss',
})
export class Launch implements OnInit {

  /**
   * Public variables
   */
  pagesList: Array<PageObject> = [];
  is_mobile = true;

  constructor(private _sharedService: SharedService,
              private _matDialog: MatDialog) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._getPagesList();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to get pages list
   */
  private _getPagesList(): void {
    this.pagesList = this._sharedService.pages;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Function to open settings dialog
   */
  openSettings(): void {
    this._matDialog.open(Settings);
  }
}
