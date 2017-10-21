import   "../../../../node_modules/tinymce/tinymce.js";
import "../../../../node_modules/tinymce/themes/modern/theme.js";
import "../../../../node_modules/tinymce/plugins/codesample/plugin.js";
import "../../../../node_modules/tinymce/plugins/autoresize/plugin.js";
import "../../../../node_modules/tinymce/plugins/code/plugin.js";
import "../../../../node_modules/tinymce/plugins/advlist/plugin.js";

import {
  Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, OnInit, OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BlogPost} from "../../models";
import {Shared} from "../../shared.service";
import {Helper} from "../../helper.service";
import {Global} from "../../Global.service";
import {ComponentService} from "../../component.service";


declare let tinymce: any;
@Component({
  selector: 'text-editor',
  templateUrl: './blog-edit.component.html',
})
export class BlogPageComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  ngOnInit() {

    setTimeout(()=>{this.helper.showProgressBarEvent.emit(false)},1000);

    //initialte blogContent here
    this.getClickedBlogPostSubscription = this.shared.getClickedBlogPost.subscribe(
      (value) => {
        this.blogInstance = value;
        // this.blogContent = this.blogInstance.blogHTML;
        this.blogContent = this.blogInstance.blogDraftHTML;
        this.blogTitle = this.blogInstance.blogTitle;
      }
    );
  }

  ngAfterViewInit() {

    this.initializeTinyMce(this.elementId);
    this._id = this.route.snapshot.params['id'];

    //this code is to fetch the blog from server when page is reloaded
    if (this._id)
      this.helper.makePostRequest('getBlogPost', {_id: this._id}).subscribe((value) => {
        this.blogInstance = value[0];

        console.log("fetching blog from server");
        console.log(this.blogInstance);
        this.editor.setContent(this.blogInstance.blogDraftHTML);
        this.blogTitle = this.blogInstance.blogTitle;
        this.blogContent = this.blogInstance.blogDraftHTML;
        this.blogInstance.blogTags.forEach((value) => {
          (<any>$('#temp')).tagsinput('add', value);
          this.ref.detectChanges();
        });
        this.setIntervalRef = setInterval(() => {
          this.updateDraftOnServer();
        }, 60000);
      });
  }

  ngOnChanges() {
    if (this.blogInstance)
      console.log(this.blogInstance.blogDraftHTML);
    //TODO: change this to ngModelChange
    if (this.editor)
      this.editor.setContent(this.blogInstance.blogDraftHTML);
  }


  updateBlogOnServer(shouldUpdateBlogHTMLAsWell: Boolean) {

    if (this.blogTitle === "") {
      alert('Title can not be empty');
      return;
    }

    this.messageFromServer = 'Saving...';
    this.populateBlogPostObject(shouldUpdateBlogHTMLAsWell);

    //update on server now
    this.helper.makePostRequest('users/saveBlogPost', this.blogInstance).subscribe(
      (value: { message: String, _id: String }) => {

        //reload the page and have new ID in URL
        let _id = value._id;
        if (!this.blogInstance._id)
          this.router.navigate(['/blogEdit/' + _id]);
        console.log(value);
        this.showMessageFromServer = true;
        if (shouldUpdateBlogHTMLAsWell === false) {
          this.messageFromServer = "Draft Autosaved!";
          this.isBlogHTMLDraftDirty = false;
        }
        else {
          this.messageFromServer = value.message;
        }
        setTimeout(() => {
          this.showMessageFromServer = false;
          this.messageFromServer = null;
        }, 3000);
      },
      (err) => {
        console.log(err)
      }
    );
  }


//==========================Helper methods======================================================================================

  @Input() elementId: string;
  @Input() value: any = "HELLLLL";
  @Output() onEditorKeyup: EventEmitter<any> = new EventEmitter<any>();
  blogInstance: BlogPost = null;
  messageFromServer = null;
  showMessageFromServer;
  getClickedBlogPostSubscription;
  setIntervalRef = null;
  showEditorBoolean: boolean = true;
  showHTMLBoolean: boolean = false;
  blogContent = "";
  blogTitle = "";
  blogImageURL = "";
  editor;
  baseURL: string = '/';
  _id=null;
  isBlogHTMLDraftDirty: Boolean = false;

  showHTML() {
    this.showHTMLBoolean = true;
  }

  showEditor() {
    this.showHTMLBoolean = false;
    this.editor.setContent(this.blogContent);
  }

  showPreviewClicked(){
    window.open('http://localhost:4200/' +this.global.blogDisplayURL + this._id, '_blank');//TODO: show in pop up rather that in a new window
  }


  updateDraftOnServer() {
    if (this.isBlogHTMLDraftDirty)
      this.updateBlogOnServer(false);
  }
  initializeTinyMce(elementId) {
    let  tempEditor;
    tinymce.init({
      selector: '#' + elementId,
      plugins: [
        'codesample autoresize',
      ],
      // external_plugins: {
      //   'testing': 'http://www.testing.com/plugin.min.js',
      //   'maths': 'http://www.maths.com/plugin.min.js'
      // },

      autoresize_bottom_margin: 100,
      // toolbar: "codesample",
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link advlist image | codesample | code ',
      image_advtab: true,
      advlist_bullet_styles: "square",  // only include square bullets in list
      skin_url: this.baseURL + 'assets/skins/lightgray',
      height: "480",
      setup: editor => {
        this.editor = editor;
        editor.on('change paste keyup', () => {
          console.log(editor.getContent({format: 'text'}));
          const content = editor.getContent();
          this.blogContent = content;
          this.ref.detectChanges();
          this.isBlogHTMLDraftDirty = true;
        });
      },
    });
    // return tempEditor;
  }

  ngOnDestroy() {
    (tinymce).remove(this.editor);
    if (this.getClickedBlogPostSubscription)
      this.getClickedBlogPostSubscription.unsubscribe();
    if (this.setIntervalRef)
      clearInterval(this.setIntervalRef);
  }

  populateBlogPostObject(shouldUpdateBlogHTMLAsWell){
    if (this.blogInstance === null) {
      this.blogInstance = this.componentService.createNewBlogPostObject();
    }
    else {
      if (shouldUpdateBlogHTMLAsWell) this.blogInstance.blogHTML = this.blogContent;

      this.blogInstance.blogTitle = this.blogTitle;
      this.blogInstance.blogText = this.editor.getContent({format: 'text'});
      this.blogInstance.blogIsDirty = false;
    }

    this.blogInstance.blogText = this.editor.getContent({format: 'text'});
    this.blogInstance.blogTitle = this.blogTitle;
    this.blogInstance.blogHTML = this.blogContent;
    this.blogInstance.blogHTML = this.blogContent;
    this.blogInstance.blogDraftHTML = this.blogContent;
    this.blogInstance.blogLastUpdatedDate = new Date();
    this.blogInstance.blogImageURL = this.blogImageURL;
    this.blogInstance.blogTags = (<any>$('#tags')).tagsinput('items');

  }

  constructor(private ref: ChangeDetectorRef, public global: Global, private helper: Helper, private shared: Shared,
              private route: ActivatedRoute, private router: Router, private componentService: ComponentService) {
  }
}


