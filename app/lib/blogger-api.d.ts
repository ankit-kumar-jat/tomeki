export interface BlogPosts {
  kind: string
  nextPageToken: string
  items: Pick<
    Post,
    'id' | 'images' | 'published' | 'title' | 'url' | 'labels' | 'updated'
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
  feed: {
    updated: FeedItemValue
    category: FeedCategory[]
    title: FeedBlogTitle
    subtitle: FeedBlogContent
    openSearch$totalResults: FeedItemValue
    openSearch$startIndex: FeedItemValue
    openSearch$itemsPerPage: FeedItemValue
    entry: FeedPostEntry[]
  }
}

export interface FeedPostEntry {
  id: FeedItemValue
  published: FeedItemValue
  updated: FeedItemValue
  category: FeedCategory[]
  title: FeedBlogTitle
  content: FeedBlogContent
  link: FeedLink[]
  media$thumbnail: FeedMediaThumbnail
}

export interface FeedCategory {
  term: string
}

export interface FeedItemValue {
  $t: string
}

export interface FeedBlogTitle {
  type: string
  $t: string
}

export interface FeedBlogContent {
  type: string
  $t: string
}

export interface FeedLink {
  rel: string
  type: string
  href: string
}

export interface FeedMediaThumbnail {
  xmlns$media: string
  url: string
  height: string
  width: string
}
