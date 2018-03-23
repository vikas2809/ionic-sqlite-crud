import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, ToastController, AlertController, ActionSheetController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html',
})
export class EditProductPage {

  product;
  product_name;
  upc;
  quantity;
  price;
  item_size;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private databaseProvider: DatabaseProvider,
              private toastController: ToastController,
              private alertController: AlertController,
              private actionSheetController: ActionSheetController,
              private viewController: ViewController) {

              this.product= this.navParams.get('product');   
              this.product_name=this.product.product_name;
              this.upc=this.product.upc;
              this.quantity=this.product.quantity;
              this.price=this.product.price;
              this.item_size=this.product.item_size;             
  }

  onDelete() {
        const actionSheet=this.actionSheetController.create({
          title: 'What do you want to do?',
          buttons: [
            {
              text: 'Remove Product',
              role: 'destructive',
              handler: ()=>{
                  this.databaseProvider.deleteProduct(this.product_name).then((res)=>{
                    console.log(res);
                    const toast = this.toastController.create({
                      message: this.product_name+' is deleted!',
                      duration: 2500,
                      position: 'bottom'
                    });
                    toast.present();
                    this.viewController.dismiss();
                  }).catch((err)=>{
                    const toast = this.toastController.create({
                      message: err,
                      duration: 2500,
                      position: 'bottom'
                    });
                    toast.present();
                  })
                    
                } 
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]
        });
        actionSheet.present();
  }

  updateProduct(){
    console.log(this.product);
      console.log(this.product_name,this.upc,this.quantity,this.price,this.item_size);
      this.databaseProvider.updateProduct(this.product_name, this.upc, this.quantity, this.price,  this.item_size).then((res)=>{
        console.log(res);      
        const toast = this.toastController.create({
                message: 'Updated successfully!',
                duration: 2500
              })
              toast.present();
              this.viewController.dismiss();
          }).catch((e)=>{
            const toast = this.toastController.create({
              message: e,
              duration: 2500
            })
            toast.present();
          })

  }


  onLeave(){
    this.navCtrl.pop();
  }

}

