export interface BlogPosts {
  kind: string
  nextPageToken: string
  items: Pick<
    Post,
    'id' | 'images' | 'published' | 'title' | 'url' | 'labels'
  >[]
}

export interface Post {
  kind: string
  id: string
  blog: Blog
  published: string
  updated: string
  url: string
  selfLink: string
  title: string
  content: string
  images: Image[]
  author: Author
  replies: Replies
  labels: string[]
  etag: string
}

export interface Blog {
  id: string
}

export interface Author {
  id: string
  displayName: string
  url: string
  image: AuthorImage
}

export interface Image {
  url: string
}

export interface Replies {
  totalItems: string
  selfLink: string
}

export interface BlogFeed {
  feed: { category: { term: string }[] }
}
