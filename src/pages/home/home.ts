import { Component } from '@angular/core';
import { NavController, ModalController, ToastController} from 'ionic-angular';
import { AddProductPage } from '../add-product/add-product';
import { EditProductPage } from '../edit-product/edit-product';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  
  products = [];
  constructor(public navCtrl: NavController,
              private databaseProvider: DatabaseProvider) {
                // this.databaseProvider.getDatabaseState().subscribe( rdy => {
                //   if(rdy) {
                //       this.loadProductData();
                //   }
                // })
              }

      //         loadProductData(){
      //           this.databaseProvider.getAllProducts().then( data =>{
      //             this.products = data;
      //           });
      // }

  pushPage(){
    console.log('push page');
    this.navCtrl.push(AddProductPage);
  }


}
