import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Config} from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor( private httpClient: HttpClient) { }
  // getCoordinatesFromAddress(address: string){
  //   return this.httpClient.get(Config.mapQuestApi + 'key=' + Config.mapQuestApiKey + '&location=' + address);
  // }
  getAddressFromCoordinates(lat: number, lng: number){
    return this.httpClient.get(Config.mapQuestGeocode +
        Config.mapQuestApiKey + '&location=' + lat.toString() + ',' + lng.toString());
  }
  getClosestAddress(address: string[]){
    const body = {
      locations: address,
      options: {
        allToAll : true
      }
    };
    return this.httpClient.post(Config.mapQuestRouteApi + Config.mapQuestApiKey , body);
  }
}
