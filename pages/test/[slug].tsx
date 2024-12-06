import type { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

interface PageProps {
  slug: string;
  retry?: boolean;
}

export default function TestPage({ slug, retry }: PageProps) {
  const router = useRouter();

  console.log({ router, retry });

  const retryCount = new URLSearchParams(router.asPath.split(/\?/)[1]).get(
    'retryCount'
  );

  if (retry && router.isReady) {
    if (Number(retryCount) >= 3) {
      router.push('/error');
      return null;
    }
    const newRetryCount = Number(retryCount || 0) + 1;
    router.push(`/test/${slug}?retryCount=${newRetryCount}`);
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Test Page</h1>
      <p>ID: {slug}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real application, you would fetch the list of possible IDs from an API or database
  const paths = [1, 2, 3].map((slug) => ({
    params: { slug: slug.toString() },
  }));

  return {
    paths,
    fallback: 'blocking', // Enable fallback for paths not generated at build time
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  ...context
}) => {
  console.log({ params, context });

  const slug = params?.slug;

  if (typeof slug !== 'string') {
    return { notFound: true };
  }

  return {
    props: {
      slug,
      retry: true, // retry: true if the request to get the blog data failed
    },
  };
};
