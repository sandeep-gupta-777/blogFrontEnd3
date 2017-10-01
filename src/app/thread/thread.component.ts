import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {BlogComment} from "../models";
import {Helper} from "../helper.service";
import {factoryOrValue} from "rxjs/operator/multicast";
import {Global} from "../Global.service";

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {

  showAddCommentBox = true;
  clickedCommentLevel ;
  clickedCommentID;
  @Input() commentBlog_id;
  constructor(private helper:Helper,private global:Global,private ref : ChangeDetectorRef){
    // this.helper.makePostRequest('blogComments',{commentBlog_id:'59abcbc02e068633ec82f4ad'}).subscribe(
    //   (value)=>{
    //     console.log(value);
    //     this.commentArray = value;
    //     this.global.blogCommentsArray = this.commentArray;
    //   }
    // );

  }

  updateThreadEvent(comment: BlogComment) {
    console.log('pushing following comment');
    console.log(comment);
    this.commentArray.unshift(comment);
    console.log(this.commentArray);
    this.showAddCommentBox = false;
    this.ref.detectChanges();
  }

  commentArray: BlogComment[] = [
    // {
    //   commentText:'hello worlds',
    //   commentHTML:'hello worlds',
    //   commentAuthor_FullName:'Sandeep',
    //   commentAuthor_PicURL:'sadas',
    //
    //   commentBlog_id:"",
    //   commentParent_id:"",
    //   commentParentLevel:0,
    //   commentChild_idArray:['sdfsdfsd'],
    //   commentLevel:0,
    //
    //   commentDate: new Date,
    //   commentLikeCount: 0
    // }


  ];

  addComment(){
    this.showAddCommentBox = !this.showAddCommentBox;
    this.clickedCommentLevel = -1;
    this.clickedCommentID = '';

  }

  ngOnInit() {
    console.log(this.commentBlog_id);
    //get all the comments for current blog
    this.helper.makePostRequest('blogComments',{commentBlog_id:this.commentBlog_id}).subscribe(
      (value)=>{
        console.log(value);
        this.commentArray = value;
        this.global.blogCommentsArray = this.commentArray;
        console.log(this.global.blogCommentsArray);
      }
    );

  }

}
