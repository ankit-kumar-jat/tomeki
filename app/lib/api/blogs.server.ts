// !NOTE: For blogs we use google blogger api and you can update them from blogger

import { BlogFeed, BlogPosts, Post } from '~/lib/blogger-api'
import {
  apiClient,
  bloggerApiClient,
  bloggerFeedApiClient,
  HOURLY_CACHE_OPTIONS,
} from './api-client.server'
import { format } from 'date-fns'
import { SitemapEntry } from '@nasa-gcn/remix-seo/build/types'

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

interface GetBlogFeedOptions {
  q?: string
  maxResults?: number
  startIndex?: number
  labels?: string
  publishedMin?: string
}

export async function getBlogFeed({
  maxResults = 10,
  startIndex,
  q,
  labels,
  publishedMin,
}: GetBlogFeedOptions) {
  const feedRes = await bloggerFeedApiClient<BlogFeed>('/posts/default', {
    params: {
      alt: 'json',
      'max-results': maxResults,
      'start-index': startIndex,
      q,
      category: labels,
      'published-min': publishedMin,
    },
    cf: HOURLY_CACHE_OPTIONS,
  })
  return formatBlogFeed(feedRes)
}

export async function getBlogLabels() {
  const feedRes = await getBlogFeed({ maxResults: 0 })

  return feedRes.labels
}

export async function getBlogSitemapEntries(): Promise<SitemapEntry[]> {
  const feedRes = await getBlogFeed({ maxResults: 2000 })

  const postEntries: SitemapEntry[] = feedRes.posts.map(post => ({
    route: `/blogs${post.path}`,
    lastmod: post.updated,
    priority: 0.7,
  }))

  const labelEntries: SitemapEntry[] = feedRes.labels.map(label => ({
    route: `/blogs?labels=${encodeURIComponent(label)}`,
    priority: 0.5,
  }))

  return [...postEntries, ...labelEntries]
}

function formatBlogFeed(feedRes?: BlogFeed) {
  return {
    labels: feedRes?.feed.category.map(({ term }) => term) ?? [],
    totalPosts: Number(feedRes?.feed.openSearch$totalResults) ?? 0,
    startIndex: Number(feedRes?.feed.openSearch$startIndex) ?? 0,
    itemsPerPage: Number(feedRes?.feed.openSearch$itemsPerPage) ?? 0,
    posts:
      feedRes?.feed.entry?.map(postEntry => ({
        id: postEntry.id.$t.split('post-')[0],
        title: postEntry.title.$t,
        coverImage: postEntry.media$thumbnail.url,
        path: new URL(
          postEntry.link.find(link => link.rel === 'alternate')?.href ||
            'https://demo.test', // this to prevent error when url is not available
        ).pathname,
        published: postEntry.published.$t,
        labels: postEntry.category.map(({ term }) => term) ?? [],
        updated: postEntry.updated.$t,
        content: postEntry.content.$t,
      })) ?? [],
  }
}
