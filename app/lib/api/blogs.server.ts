// !NOTE: For blogs we use google blogger api and you can update them from blogger

import { BlogFeed, BlogPosts, Post } from '~/lib/blogger-api'
import {
  apiClient,
  bloggerApiClient,
  HOURLY_CACHE_OPTIONS,
} from './api-client.server'
import { format } from 'date-fns'
import { BLOGGER_BLOG_NAME, SITE_URL } from '~/config/site'

interface GetBlogPostsOptions {
  key: string
  labels?: string
  maxResults?: number
  pageToken?: string
  orderBy?: 'UPDATED' | 'PUBLISHED'
  sortOption?: 'DESCENDING' | 'ASCENDING'
  quotaUser?: string
  status?: 'LIVE' | 'DRAFT' | 'SCHEDULED' | 'SOFT_TRASHED'
}

export async function getBlogPosts({
  key,
  maxResults,
  labels,
  pageToken,
  status = 'LIVE',
  quotaUser,
  orderBy,
  sortOption,
}: GetBlogPostsOptions) {
  const blogPostsRes = await bloggerApiClient<BlogPosts>('/posts', {
    params: {
      key,
      fetchImages: true,
      fetchBodies: false,
      maxResults,
      pageToken,
      labels,
      status,
      quotaUser,
      orderBy,
      sortOption,
      fields:
        'kind,nextPageToken,items(id,url,title,images,published,labels,updated)',
    },
    cf: HOURLY_CACHE_OPTIONS,
  })

  const formattedPosts =
    blogPostsRes?.items?.map(post => ({
      id: post.id,
      title: post.title,
      coverImage: post.images?.[0]?.url ?? '',
      path: new URL(post.url).pathname,
      published: format(new Date(post.published), 'MMMM dd, yyyy'),
      labels: post.labels,
      updated: post.updated, // need this for sitemap
    })) ?? []

  return {
    nextPageToken: blogPostsRes?.nextPageToken ?? null,
    posts: formattedPosts,
  }
}

interface GetBlogPostOptions {
  key: string
  path: string
}

export async function getBlogPost({ key, path }: GetBlogPostOptions) {
  const blogPostsRes = await bloggerApiClient<
    Pick<
      Post,
      'id' | 'title' | 'images' | 'published' | 'updated' | 'content' | 'labels'
    >
  >('/posts/bypath', {
    params: {
      key,
      path,
      fetchImages: true,
      fields: 'id,title,images,published,updated,content,labels',
    },
    cf: HOURLY_CACHE_OPTIONS,
  })
  return blogPostsRes
}

export async function getBlogLabels() {
  const feedRes = await apiClient<BlogFeed>(
    {
      endpoint: '/feeds/posts/summary',
      url: `https://${BLOGGER_BLOG_NAME}.blogspot.com/`,
    },
    {
      params: { alt: 'json', 'max-results': 0 },
      cf: HOURLY_CACHE_OPTIONS,
    },
  )

  return feedRes?.feed.category.map(({ term }) => term) ?? []
}

export async function getBlogSitemapEntries() {
  const blogPostsRes = await apiClient<ReturnType<typeof getBlogPosts>>(
    { endpoint: '/blogs', url: SITE_URL },
    {
      params: { _data: 'routes/blogs._index' },
      cf: HOURLY_CACHE_OPTIONS,
    },
  )

  if (!blogPostsRes?.posts) return []

  return blogPostsRes.posts.map(post => ({
    route: `/blogs${post.path}`,
    lastmod: post.updated,
  }))
}
