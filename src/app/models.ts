// export class ImageContainer {
//
//
//   constructor( _id:string,  imageId: string,   imageName: string,  imageTags: string[],
//                 imageURL: string,   imageAuthor: string,  imageAuthor_id: string,   imageVoteCount?: number,
//                 imagePublishDate?: string,   imageComments?: string) {
//   }
// }


export interface ImageContainer{

  _id?:string,
  imageId: string,
  imageName: string,
  imagePublishDate: string,
  imageAuthor: string,
  imageAuthor_id: string,
  imageURL?: string,  imageVoteCount?: number,  imageTags?: string[],   imageComments?: string

}



export interface SiteUser {
  _id?:string,

  userName: string,
  password: string,
  fullName?: string,
  email?: string,

  profileID?: string,  profilePicURL?: string,  votes?: string[], comments?: { comment: string; image: string }[],  uploaded?: string[],   dateOfSignup?: Date,   lastLogin?: Date
}

export interface BlogPost{
  _id?:string,
  blogTitle?:string,
  blogHTML?:string,
  blogDraftHTML?:string,
  blogIsDirty?:boolean,
  blogText?:String,
  blogAuthor_id?:string,
  blogAuthor_fullName?:string,
  blogCreationDate?:Date,
  blogLastUpdatedDate?:Date,
  blogLikes?:[String],
  blogViews?:number,
  blogComments?:string[],
  blogCommentsCount?:number,
  blogTags?:[String],
  blogRelevency?:number,
  blogImageURL?: String,
  blogPrivateMode?:number


}

//TODO: Answer this https://stackoverflow.com/questions/11304739/how-to-store-threaded-comments-using-mongodb-and-mongoose-for-node-js

export interface Thread {
  _id?: string,
  threadComment_idArray: [string],

  threadDate: Date,
}

export interface BlogComment{
  _id?: string,
  commentText?:string,
  commentHTML?:string,
  commentAuthor_FullName?:string,
  commentAuthor_PicURL?:string,

  commentBlog_id?:string,//
  commentParent_id?:string,
  commentParentLevel?:number,
  commentChild_idArray?:[string],
  commentLevel?:number,
  commentRankCode?:string,


  commentDate?: Date,
  commentLikes?: [String]

}

export interface CriteriaObject{
  url?:string,
  user_id:string,
  requestType:string,
  searchQuery?:string,
  source?:string,
  searchQueryTImeStamp?:number,
    shouldNavigateToSRP? :boolean

}
