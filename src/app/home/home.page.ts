import {Component, OnInit} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {MapService} from '../services/map.service';
const {Geolocation} = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  private address = [];
  private currentLng;
  private  currentLat;
  private currentAddress;
  private closestAddress;
  constructor(private mapService: MapService) {}
  async ngOnInit(){
      await this.getCurrentAddress();
  }
  async getCurrentAddress(){
      await Geolocation.getCurrentPosition().then( async coordinates => {
          console.log('coo :', coordinates.coords);
          this.currentLat = coordinates.coords.latitude;
          this.currentLng = coordinates.coords.longitude;
          this.mapService.getAddressFromCoordinates(coordinates.coords.latitude, coordinates.coords.longitude).subscribe(data => {
                  const addressObject = (data as any).results[0].locations[0];
                  const currentAddress = addressObject.street + ' ' + addressObject.adminArea6 + ' ' + addressObject.adminArea5 +
                      ' ' + addressObject.adminArea4 + ' ' + addressObject.adminArea3 + ' ' + addressObject.adminArea1 +
                      ' ' + addressObject.postalCode;
                  this.currentAddress = currentAddress;
                  this.address.unshift(currentAddress);
              });
      });
  }

    getClosest(){
      const address = this.address.map(a => a.replace(/,/g, ', '));
      this.mapService.getClosestAddress(address).subscribe(data => {
          const res = (data as any);
          console.log( 'distances', res.distance);
          if (res.info.statuscode === 0){
              this.closestAddress = this.address[res.distance[0]
                  .indexOf(Math.min(...res.distance[0].slice(1, )))];
              console.log(this.closestAddress);
          } else {
               this.closestAddress = 'error : pls check your address';
          }
      });
    }
}

