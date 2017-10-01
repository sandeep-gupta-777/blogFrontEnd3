import {Component, ElementRef, OnInit} from '@angular/core';
import {ImageContainer} from "../models";
import {Shared} from "../shared.service";
import * as jquery from "jquery";
import {Helper} from "../helper.service";
import {Global} from "../Global.service";
@Component({
  selector: 'app-image-side-panel',
  templateUrl: './sidebar1.component.html',
  styleUrls: ['./sidebar1.component.css']
})
export class ImageSidePanel implements OnInit{

  ngOnDestroy(): void {

    if(this.getImageContainersSubscription)
      this.getImageContainersSubscription.unsubscribe();
  }

array1 = ['sandeep','guopta'];
  editMode = false;
  private getImageContainersSubscription;
  $carousel=null;
  imageContainer: ImageContainer = {imageId: 'not set', imageName: 'not set',    imagePublishDate: 'not set',    imageAuthor: 'not set', imageAuthor_id: 'not set'};

  constructor(private shared:Shared, private el: ElementRef, private helper:Helper, private global: Global){
    // console.log('helloooooooo');

  }

  isUserAlsoOwnerOfThisImage(imageAuthor_id){
    //TODO: this method is called by 4 time, debug it
    let temp = this.global.getLoggedInUserDetails();
    if(!temp) return false;
    return imageAuthor_id ===this.global.getLoggedInUserDetails()._id;
  }

  triggerAllIconObservable(searchQuery){
    // if(searchQuery)
      // this.searchQuery = searchQuery;
    this.helper.notifyKeywordChangeEvent.emit(searchQuery);
    this.helper.setKeywordIntoSearchBarEvent.emit(searchQuery);
    this.helper.triggerIconGridComponentGetImages('AllIcons','POST',  searchQuery);

  }

  makeTagsEditable(){
    this.imageContainer.imageTags.
    forEach(function (value) {
      (<any>$('#temp')).tagsinput('add',value);
    });
  }

  toggleEditModeAndSave(){
    this.editMode= !this.editMode;
    if(this.editMode)
      this.makeTagsEditable();
    else {
      //save all the changed values
      // imageContainer.imageName
      //this.imageContainer.imagedescription

      this.imageContainer.imageTags =  (<any>$('#tags')).tagsinput('items');
      // console.log((<any>$('#tags')).tagsinput('items'));
      //make a call to save this object
      this.helper.saveEditedImageContainer(this.imageContainer).subscribe(
        (value)=>{console.log(value)}
      );

    }

  }


  ngOnInit(): void {
    this.getImageContainersSubscription = this.shared.getImageContainers.subscribe(
      (value)=>{
        console.log("in ng on init of sidebar1.component.ts");
        this.imageContainer = value
      }
    );
  }

}
