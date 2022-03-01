import { Fragment } from "react";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title> React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of amazing meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}
// getServerSideProps instead for server side
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://Paris:GDWDyixVdHvu2tnY@cluster0.ihuph.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, // number of seconds next js will wait to regenerate the page
  };
}

export default HomePage;
