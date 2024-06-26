import type { IFeedPost } from '@/models/feed_post_model'
import { instance } from '../utils/network_manager'
import { defineStore } from 'pinia'
import type { IPostModel } from '@/models/post_model'
import type { IComment } from '@/models/comment_model'
import type { ICommunityPost } from '@/models/community_post_model'
import type { ICreateComment } from '@/models/create_comment_model'

export const usePostStore = defineStore('postStore', {
  state: () => ({
    feed: [] as Array<IFeedPost>,
    userPosts: [] as Array<IPostModel>,
    communityPosts: [] as Array<ICommunityPost>,
    savedPosts: [] as Array<IFeedPost>,
    post: {} as IPostModel,
    postComments: [] as Array<IComment>,
    comment: {} as IComment,
    commentNode: [] as Array<IComment>,
    commentReplies: [] as Array<IComment>,
    statusCode: 0 as number
  }),
  getters: {
    _feed: (state: any) => state.feed as Array<IFeedPost>,
    _userPosts: (state: any) => state.userPosts as Array<IPostModel>,
    _communityPosts: (state: any) => state.communityPosts as Array<ICommunityPost>,
    _savedPosts: (state: any) => state.savedPosts as Array<IFeedPost>,
    _post: (state: any) => state.post as IPostModel,
    _postComments: (state: any) => state.postComments as Array<IComment>,
    _comment: (state: any) => state.comment as IComment,
    _commentNode: (state: any) => state.commentNode as Array<IComment>,
    _commentReplies: (state: any) => state.commentReplies as Array<IComment>,
    _statusCode: (state: any) => state.statusCode as number
  },
  actions: {
    async getPostFeed(skip: string) {
      try {
        const res = await instance.get(`/Post/feed?take=10&skip=${skip}`)
        console.log(res.data)
        this.feed = res.data.data
        // res.data.data.forEach((element: IFeedPost) => this.feed.push(element));
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async getUserPosts(userId: string) {
      try {
        const res = await instance.get(`/Post/User/${userId}?skip=0&take=10`)
        console.log(res.data)
        this.userPosts = res.data.data
        // res.data.data.forEach((element: IPostModel) =>
        //   this.userPosts.push(element)
        // );
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async savePost(id: string) {
      const res = await instance.post(`/post/save/${id}`, {})
      console.log(res.data)
    },

    async getSavedPosts() {
      try {
        const res = await instance.get('/post/saved-posts')
        console.log(res.data)
        this.savedPosts = res.data.data
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async getPostById(id: string) {
      try {
        const res = await instance.get(`/Post/GetPost?id=${id}`)
        console.log(res.data)
        this.post = res.data.data
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async getPostComments(id: string) {
      try {
        const res = await instance.get(`/post/${id}/comments?skip=0&take=10`)
        console.log(res.data.data)
        this.postComments = res.data.data
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async getCommentReplies(commentId: string) {
      try {
        const res = await instance.get(`/post/comment/${commentId}/replies?skip=0&take=10`)
        console.log(res.data)
        this.commentReplies = res.data.data
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async interactComment(commentId: string, interactionType: string) {
      try {
        const res = await instance.get(
          `/post/comment/${commentId}/interaction?type=${interactionType}`
        )
        console.log(res.data)
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async getCommunityPosts(communityId: string) {
      try {
        const res = await instance.get(`/Post/community/${communityId}`)
        console.log(res.data)

        this.communityPosts = res.data.data
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async createPost(postObject: object) {
      try {
        const res = await instance.post('/post/create', postObject)
        console.log(res)
        this.statusCode = res.data.statusCode
      } catch (error: any) {
        console.log(error.data)
      }
    },

    async deletePost({ postId, userId }: any) {
      try {
        const res = await instance.post('/post/delete', { postId })
        // await context.dispatch("getUserPosts");
        await usePostStore().getUserPosts(userId)
        console.log(res.data)
      } catch (error: any) {
        console.log(error.response.data)
      }
    },

    async createComment(message: ICreateComment) {
      try {
        const res = await instance.post('/Post/Comment', message)
        console.log(res.data)
        this.statusCode = res.data.statusCode
        setTimeout(() => {
          this.statusCode = 0
        }, 3000)
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async deleteComment({ commentId, postId }: any) {
      try {
        const res = await instance.post(`/post/comment/delete/${commentId}`)
        console.log(res.data)
        if (res.data.statusCode === 200) {
          await usePostStore().getPostComments(postId)
        }
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async editComment(commentId: string, message: any) {
      try {
        const res = await instance.put(`/post/comment/${commentId}/update`, {
          message
        })
        console.log(res.data)
        this.statusCode = res.data.statusCode
        setTimeout(() => {
          this.statusCode = 0
        }, 3000)
      } catch (error: any) {
        console.log(error.message)
      }
    },

    async interactionPost({ interactionType, targetId }: any) {
      try {
        const res = await instance.post(`/post/interaction/${targetId}`, {
          interactionType
        })
        console.log(res.data)
      } catch (error: any) {
        console.log(error.data)
      }
    },

    async removeInteractionPost(targetId: string) {
      try {
        const res = await instance.post(`/post/remove-interaction/${targetId}`)
        console.log(res.data)
      } catch (error: any) {
        console.log(error.data)
      }
    },
    resetPostAndComments(state: any) {
      state.post = {}
      state.postComments = []
    }
  }
})
