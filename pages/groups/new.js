import Head from 'next/head';
import CreateGroupForm from '../../components/groups/CreateGroupForm';

export default function NewGroup() {
  return (
    <>
      <Head>
        <title>New Group | SplitEasy</title>
      </Head>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <CreateGroupForm />
      </div>
    </>
  );
}
