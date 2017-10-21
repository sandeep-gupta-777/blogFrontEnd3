import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';


import {Helper} from "../../helper.service";
import {Global} from "../../Global.service";
import {BlogComment} from "../../models";

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
    //get all the comments for current blog
    this.helper.makePostRequest('blogComments',{commentBlog_id:this.commentBlog_id}).subscribe(
      (value)=>{
        this.commentArray = value;
        this.global.blogCommentsArray = this.commentArray;
      }
    );

  }

}
