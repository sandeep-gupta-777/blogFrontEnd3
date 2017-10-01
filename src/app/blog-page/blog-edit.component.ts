

import {
  Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, OnInit, OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import {BlogPost} from "../models";
import {Global} from "../Global.service";
import {Helper} from "../helper.service";
import {factoryOrValue} from "rxjs/operator/multicast";
import {Shared} from "../shared.service";
import {ActivatedRoute, Router} from "@angular/router";
// let  Prism = require('prismjs');


declare let tinymce: any;
@Component({
  selector: 'text-editor',
  templateUrl: './blog-edit.component.html',
})
export class BlogPageComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {


  @Input() elementId: string;
  @Input() value: any = "HELLLLL";
  @Output() onEditorKeyup: EventEmitter<any> = new EventEmitter<any>();
  blogInstance:BlogPost= null ;
  messageFromServer = null;
  showMessageFromServer;
  getClickedBlogPostSubscription;
  setIntervalRef = null;
  showEditorBoolean:boolean=true;
  showHTMLBoolean:boolean = false;
  blogContent = "";
  blogTitle="";
  blogImageURL="";
  editor;
  baseURL: string = '/';
  _id;
  isBlogHTMLDraftDirty:Boolean= false;


  constructor(private ref : ChangeDetectorRef, public global:Global, private helper:Helper, private shared:Shared,
              private route: ActivatedRoute,private router:Router
  ) {
  }

  ngOnInit() {


    //initialte blogContent here
    this.getClickedBlogPostSubscription = this.shared.getClickedBlogPost.subscribe(
      (value)=>{
        console.log(value);
        this.blogInstance = value;
        // this.blogContent = this.blogInstance.blogHTML;
        this.blogContent = this.blogInstance.blogDraftHTML;
        this.blogTitle = this.blogInstance.blogTitle;
      }
    );
  }

  ngAfterViewInit() {
  tinymce.init({
    selector: '#' + this.elementId,
    plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code fullscreen',
      'insertdatetime media nonbreaking save table contextmenu directionality',
      'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help autoresize',
    ],

    autoresize_bottom_margin: 100,
    // toolbar: "codesample",
    toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
    toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
    image_advtab: true,
    advlist_bullet_styles: "square",  // only include square bullets in list
    skin_url: this.baseURL + 'assets/skins/lightgray',
    height : "480",
    setup: editor => {
      this.editor = editor;
      editor.on('change paste keyup', () => {
        console.log(editor.getContent({ format: 'text' }));
        const content = editor.getContent();
        this.blogContent = content;
        this.ref.detectChanges();
        this.isBlogHTMLDraftDirty = true;
        // this.onEditorKeyup.emit(content);
      });
    },
  });
  // setTimeout(()=>{this.editor.setContent("hello")},0);
  //  TODO: Make server requests as early as possible
    this._id = this.route.snapshot.params['id'];

    //this code is to fetch the blog from server when page is reloaded
    if(this._id) //only if there is id in URL
    this.helper.makePostRequest('getBlogPost', {_id: this._id}).subscribe((value) => {
      this.blogInstance = value[0];

      console.log("fetching blog from server");
      console.log(this.blogInstance);
      this.editor.setContent(this.blogInstance.blogDraftHTML);
      this.blogTitle = this.blogInstance.blogTitle;
      // this.blogContent = this.blogInstance.blogHTML;
      this.blogContent = this.blogInstance.blogDraftHTML;
      // this.imageContainer.imageTags.
      this.blogInstance.blogTags.forEach( (value)=> {
        // console.log('sssssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
        (<any>$('#temp')).tagsinput('add',value);
        this.ref.detectChanges();

      });

      this.setIntervalRef = setInterval(()=>{
        this.updateDraftOnServer();
      },60000);

    });

  }




  ngOnDestroy() {
    (tinymce).remove(this.editor);
    if(this.getClickedBlogPostSubscription)
      this.getClickedBlogPostSubscription.unsubscribe();
    if(this.setIntervalRef)
      clearInterval(this.setIntervalRef);
  }

  ngOnChanges(){
    if(this.blogInstance)
    console.log(this.blogInstance.blogDraftHTML);
    //TODO: change this to ngModelChange
    if(this.editor)
    this.editor.setContent(this.blogInstance.blogDraftHTML);



  }
  showEditor(){
    this.showEditorBoolean=true;
    this.showHTMLBoolean = false;
    this.showEditorBoolean= true;

    if(this.editor)
    (tinymce).remove(this.editor);

    setTimeout(()=>{
      tinymce.init({
        selector: '#' + this.elementId,
        plugins: [
          'advlist autolink lists link image charmap print preview hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen',
          'insertdatetime media nonbreaking save table contextmenu directionality',
          'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc help autoresize',
        ],

        autoresize_bottom_margin: 100,
        toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample help',
        image_advtab: true,
        advlist_bullet_styles: "square",  // only include square bullets in list
        skin_url: this.baseURL + 'assets/skins/lightgray',
        height: "480",
        setup: editor => {
          this.editor = editor;
          editor.on('change paste keyup', () => {
            const content = editor.getContent();
            this.blogContent = content;
            this.ref.detectChanges();
            // this.onEditorKeyup.emit(content);
          });
        },
      });
      // this.editor.setContent(this.blogContent);
      setTimeout(()=>{this.editor.setContent(this.blogContent)},0);
    },0);
  }
  showHTML(){
    this.showEditorBoolean=false;
    this.showHTMLBoolean = true;
    (tinymce).remove(this.editor);
  }
  // showPreview(){
  //
  // }

  updateDraftOnServer(){
    if(this.isBlogHTMLDraftDirty)
      this.updateBlogOnServer(false);
  }

  updateBlogOnServer(shouldUpdateblogHTMLAsWell:Boolean){
      // this.blogInstance.blogAuthor_id = this.global.getLoggedInUserDetails()._id;


    // this.blogContent = Prism.highlight(this.blogContent, Prism.languages.javascript);
    // this.html = html;
    // console.log(html);

    this.messageFromServer = 'Saving...';
    let text = this.editor.getContent({format: 'text'});

    if(this.blogTitle==="")
      {
        alert('Title can not be empty');
        return;
      }
    if (this.blogInstance===null)
      this.blogInstance = {
        blogHTML: this.blogContent,
        blogDraftHTML: this.blogContent,
        blogTitle: this.blogTitle,
        blogText: this.editor.getContent({format: 'text'}),
        blogRelevency: 0,
        blogAuthor_id: this.global.getLoggedInUserDetails()._id,
        blogAuthor_fullName: this.global.getLoggedInUserDetails().fullName,
        blogCreationDate:new Date(),
        blogLastUpdatedDate:new Date(),
        blogIsDirty:true,
        blogImageURL: this.blogImageURL
      };
     else {
       if(shouldUpdateblogHTMLAsWell){
         this.blogInstance.blogHTML= this.blogContent;
       }
        this.blogInstance.blogDraftHTML= this.blogContent;
        this.blogInstance.blogTitle= this.blogTitle;
        this.blogInstance.blogText= this.editor.getContent({format: 'text'});
        this.blogInstance.blogLastUpdatedDate = new Date();
        this.blogInstance.blogIsDirty = false;
        this.blogInstance.blogImageURL = this.blogImageURL;
    }
    this.blogInstance.blogTags =  (<any>$('#tags')).tagsinput('items');
    console.log(this.blogInstance);
      //update on server now
    this.helper.makePostRequest('users/saveBlogPost',this.blogInstance).subscribe(
      (value:{message:String,_id:String})=>{

        //reload the page and have new ID in URL
        let _id = value._id;
        if(!this.blogInstance._id)
        this.router.navigate(['/blogEdit/'+_id]);
        console.log(value);
        this.showMessageFromServer=true;
        if(shouldUpdateblogHTMLAsWell === false){
          this.messageFromServer = "Draft Autosaved!";
          this.isBlogHTMLDraftDirty = false;
        }
        else {
          this.messageFromServer = value.message;
        }
        setTimeout(() => {
          this.showMessageFromServer = false;
          this.messageFromServer=null;
        }, 3000);
      },
      (err)=>{console.log(err)}
    );
  }
}
