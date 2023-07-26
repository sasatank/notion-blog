import Image from 'next/image'
import { Inter } from 'next/font/google'
import { getAllPosts, getPostsForTopPage } from '../../lib/notionAPI'
import Head from 'next/head';
import SinglePost from 'components/Post/SinglePost.tsx';
import { GetStaticProps } from 'next';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async () => {
  const fourPosts = await getPostsForTopPage(4);
  return {
    props: {
      fourPosts,
    },
    revalidate: 60 * 60 * 6,
  };
}

// const inter = Inter({ subsets: ['latin'] })

export default function Home({fourPosts}) {
  
  return (
    
    <div className='container h-full w-full mx-auto'>
      <Head>
      <title>Notion-blog</title>
      {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className='container w-full mt-16'>
        <h1 className='text-5xl font-medium text-center mb-16'>Notion Blog 🚀</h1>
        {fourPosts.map((post) => (
          <div className='mx-4' key={post.id}>
            <SinglePost
            
            title ={post.title}
            description={post.description}
            date={post.date}
            tags={post.tags}
            slug={post.slug}
            isPaginationPage={false}
            />
          </div>
        ))}
        
      </main>
      <Link href="/posts/page/1" className='mb-6 lg:w-1/2 mx-auto  px-5 block text-right'>...もっと見る</Link>
    </div>
  )
}
