import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Pagination from "../../../../components/Pagination/Pagination";
import SinglePost from "../../../../components/Post/SinglePost";
import Tag from "../../../../components/Tag/Tag";
import {
  getAllPosts,
  getAllTags,
  // getAllTags,
  getNumberOfPages,
  getPostsByPage,
  getPostsForTopPage,
} from "../../../../lib/notionAPI";

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPage = await getNumberOfPages();

  let params = [];
  for (let i = 1; i <= numberOfPage; i++) {
    params.push({ params: { page: i.toString() } });
  }

  return {
    paths: params,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage = context.params?.page;
  const postsByPage = await getPostsByPage(
    parseInt(currentPage.toString(), 10)
  );
  const numberOfPage = await getNumberOfPages();

  const allTags = await getAllTags();

  return {
    props: {
      postsByPage,
      numberOfPage,
      allTags,
    },
    revalidate: 1,
  };
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const currentPage = context.params?.page;
//   const postsByPage = await getPostsByPage(
//     parseInt(currentPage.toString(), 10)
//   );
//   const numberOfPage = await getNumberOfPages();

//   const allTags = await getAllTags();

//   return {
//     props: {
//       postsByPage,
//       numberOfPage,
//       allTags,
//     },
//     // revalidate: 10,
//   };
// };

const BlogPageList = ({ postsByPage, numberOfPage, allTags }) => {
  return (
    <div className="container h-full w-full mx-auto">
      <Head>
        <title>Notion-Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          Sho Blog🐈🐈
        </h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {postsByPage.map((post) => (
            <div key={post.id}>
              <SinglePost
                title={post.title}
                description={post.description}
                date={post.date}
                tags={post.tags}
                slug={post.slug}
                isPaginationPage={true}
              />
            </div>
          ))}
        </section>
        <Pagination numberOfPage={numberOfPage} tag={""} />
        <Tag tags={allTags} />
      </main>
    </div>
  );
};

export default BlogPageList;