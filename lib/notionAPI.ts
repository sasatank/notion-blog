// Import necessary types
import { Client, PaginatedList, PropertyValueMap, TitlePropertyValue } from "@notionhq/client";
import { NotionToMarkdown, Page } from "notion-to-md";
import { NUMBER_OF_POSTS_PER_PAGE } from '../constants/constants';

// Define types for post properties
type Post = {
  id: string;
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
};

// Function to extract tags from a post
const getTags = (tags: PropertyValueMap['Tags']['multi_select']): string[] => {
  return tags.map((tag) => tag.name);
};

// Function to extract metadata from a post
const getPageMetaData = (post: Page): Post => {
  return {
    id: post.id,
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tags: getTags(post.properties.Tags.multi_select),
  };
};

// Notion Client setup
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Function to fetch all posts from Notion
export const getAllPosts = async (): Promise<Post[]> => {
  const posts: PaginatedList<Page> = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    page_size: 100,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  const allPosts: Page[] = posts.results;

  return allPosts.map((post) => getPageMetaData(post));
};

// Function to fetch a single post from Notion using slug
export const getSinglePost = async (slug: string): Promise<{ metadata: Post; markdown: string }> => {
  const response: PaginatedList<Page> = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  const page: Page = response.results[0];
  const metadata: Post = getPageMetaData(page);

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);

  return {
    metadata,
    markdown: mdString,
  };
};

// Function to get top page posts (four posts)
export const getPostsForTopPage = async (pageSize: number): Promise<Post[]> => {
  const allPosts: Post[] = await getAllPosts();
  const fourPosts: Post[] = allPosts.slice(0, pageSize);
  return fourPosts;
};

// Function to get posts by page number
export const getPostsByPage = async (page: number): Promise<Post[]> => {
  const allPosts: Post[] = await getAllPosts();
  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
  return allPosts.slice(startIndex, endIndex);
};

// Function to get the number of pages based on the number of posts per page
export const getNumberOfPages = async (): Promise<number> => {
  const allPosts: Post[] = await getAllPosts();
  return Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE) + (allPosts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0);
};

// Function to get posts by tag and page number
export const getPostsByTagAndPage = async (tagName: string, page: number): Promise<Post[]> => {
  const allPosts: Post[] = await getAllPosts();
  const posts: Post[] = allPosts.filter((post) => post.tags.find((tag: string) => tag === tagName));
  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
  return posts.slice(startIndex, endIndex);
};

// Function to get the number of pages by tag
export const getNumberOfPagesByTag = async (tagName: string): Promise<number> => {
  const allPosts: Post[] = await getAllPosts();
  const posts: Post[] = allPosts.filter((post) => post.tags.find((tag: string) => tag === tagName));
  return Math.floor(posts.length / NUMBER_OF_POSTS_PER_PAGE) + (posts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0);
};

// Function to get all tags from posts
export const getAllTags = async (): Promise<string[]> => {
  const allPosts: Post[] = await getAllPosts();
  const allTagsDuplicationLists = allPosts.flatMap((post) => post.tags);
  const set = new Set(allTagsDuplicationLists);
  const allTagsList = Array.from(set);
  console.log(allTagsList);
  return allTagsList;
};
