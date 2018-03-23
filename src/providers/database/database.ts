import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Platform } from 'ionic-angular';

@Injectable()
export class DatabaseProvider {

database: SQLiteObject;
private databaseReady: BehaviorSubject<boolean>;

  constructor(public http: Http,
              private sqlitePorter: SQLitePorter,
              private storage: Storage,
              private sqlite: SQLite,
              private platform: Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(()=>{
        this.sqlite.create({
          name: 'product.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
            this.database=db;
            this.storage.get('database_filled').then(val=>{
              if(val){
                  this.databaseReady.next(true);
              } else {
                this.fillDatabase();
              }
            })
        })
    })
  }

  fillDatabase(){
      this.http.get('assets/table.sql')
      .map(res => res.text())
      .subscribe(sql=>{
        this.sqlitePorter.importSqlToDb(this.database, sql).then(data=>{
          this.databaseReady.next(true);
          this.storage.set('database_filled', true);
        }).catch(e=> console.log(e));
      });
  }

addProduct(product_name,upc,quantity,price,item_size){
    let data = [product_name,upc,quantity,price,item_size];
    return this.database.executeSql("INSERT INTO product(product_name, upc, quantity, price, item_size) VALUES (?, ?, ?, ?, ?)", data).then( res =>{
      return res;
    });
}

getAllProducts() {
    return this.database.executeSql("SELECT * FROM product", []).then(data=>{
      let products = [];
      if(data.rows.length > 0){
        for(var i=0;i<data.rows.length; i++){
          products.push({product_name: data.rows.item(i).product_name, upc: data.rows.item(i).upc, quantity: data.rows.item(i).quantity, price: data.rows.item(i).price, item_size: data.rows.item(i).item_size})
        }
      }
      return products;
    }, err =>{
      console.log('Error: ', err)
      return [];
        });
}


updateProduct(product_name,upc,quantity,price,item_size){
  let data=[upc,quantity,price,item_size,product_name];
  console.log(data);
    return this.database.executeSql("UPDATE product SET upc=?, quantity=?, price=?, item_size=? WHERE product_name=?", data);
}


deleteProduct(product_name){
  return this.database.executeSql("DELETE FROM product WHERE product_name=?", [product_name]);
}

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
