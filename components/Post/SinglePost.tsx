import Link from 'next/link';
import React from 'react';
import { TypeFlags } from 'typescript';

type Props = {
  title: String;
  description: String;
  date: String;
  tags: String[];
  slug: String;
  isPaginationPage: boolean;
}

const SinglePost = (props: Props) => {
  const { title, description, date, tags, slug, isPaginationPage } = props;
  return (
    <>
      {isPaginationPage ? (
        <section className=" bg-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className='lg:flex items-center gap-3'>
            <h2 className='text-gray-100 text-2xl fond-medium mb-2'>
              <Link href={`/posts/${slug}`}>
                {title}
              </Link>
            </h2>
            <div className='text-gray-400 mr2'>{date}</div>
            {tags.map((tag,index: number) => (
              
                <span className='text-white bg-gray-500 rounded-xl px-2 pb-1 font-medium mr-2' key={index}>{tag}</span>
              
            ))}


          </div>
          <p className='text-gray-100'>{description}</p>
        </section>
      ) : (
        <section className="lg:w-1/2 bg-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className='flex items-center gap-3'>
            <h2 className='text-gray-100 text-2xl font-medium mb-2'>
              <Link href={`/posts/${slug}`}>
                {title}
              </Link>
            </h2>
            <div className='text-gray-100'>{date}</div>
            {tags.map((tag,index: number) => (
              
                <span className='text-white bg-gray-500 rounded-xl px-2 pb-1 font-medium' key={index}>{tag}</span>
              
            ))}


          </div>
          <p className='text-gray-400'>{description}</p>
        </section>
      )}
    </>


  );
};

export default SinglePost;