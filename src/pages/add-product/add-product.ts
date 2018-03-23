import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastController, ViewController, ModalController, NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatabaseProvider } from '../../providers/database/database';
import { EditProductPage } from '../edit-product/edit-product';

@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {

  upc_code: any;
  product_info= {};
  products= [];

  constructor(
    private toastController: ToastController,
    private viewController: ViewController,
    private barcodeScanner: BarcodeScanner,
    private modalController: ModalController,
    private navController: NavController,
    private databaseProvider: DatabaseProvider){
      this.databaseProvider.getDatabaseState().subscribe( rdy => {
        if(rdy) {
            this.loadProductData();
        }
      })
    }

    loadProductData(){
      this.databaseProvider.getAllProducts().then( data =>{
        this.products = data;
      });
    }

  onSubmit(form: NgForm){
      let product_name=form.value.product_name;
      let upc= form.value.upc;
      let quantity=form.value.quantity;
      let price = form.value.price;
      let item_size=form.value.item_size;
    console.log(typeof quantity);
      this.databaseProvider.addProduct(product_name,upc,parseInt(quantity),parseInt(price),parseInt(item_size)).then((data)=>{
        const toast=this.toastController.create({
          message: 'Product Added Successfully!',
          duration: 2500,
        })
        toast.present();
        this.loadProductData();
      }).catch((e)=>{
        const toast=this.toastController.create({
          message: e,
          duration: 2500,
        })
        toast.present();
      })

     form.reset();
      // this.viewController.dismiss();
  }

  openCameraScanner(){
  //  console.log('camera scanner');
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.upc_code = barcodeData;
     }).catch(err => {
         console.log('Error', err);
     });
  }

  productSelected(product){ 
    const modal= this.modalController.create(EditProductPage, {product: product});
    modal.present();
    modal.onDidDismiss(
      () =>{
        this.loadProductData();
      })
  }

}
