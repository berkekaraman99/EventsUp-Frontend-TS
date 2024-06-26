export interface IUser {
  bannerImage: string | null
  bio: string | null
  communities: Array<any>
  communityCount: number
  email: string
  fullName: string
  followersCount: number
  followingCount: number
  gender: number
  id: string
  isBlocked: boolean
  isFollowRequestReceived: boolean
  isFollowRequestSent: boolean
  isFollowing: boolean
  isPrivate: boolean
  posts: Array<any>
  profileImage: string | null
  userName: string
}
