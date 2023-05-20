import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch"

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    lastName: String!
    firstName: String!
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }

  """
  Tweet object represents a resource for a Tweet
  """

  type Tweet {
    id:ID!
    text: String!
    author: User
  }
  

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Int!
    summary: String
    description_full: String!
    synopsis: String!
    yt_trailer_code: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
    state: String!
    date_uploaded: String!
    date_uploaded_unix: Int!
    torrents: [Torrents!]!
    genres: [String!]!
  }

  type Torrents {
    url: String
    hash: String
    quality: String
    type: String
    seeds: Int
    peers: Int
    size: String
    size_bytes: Int
    date_uploaded: String
    date_uploaded_unix: Int
  }

  type Query {
    allTweets: [Tweet]!
    tweet(id: ID!): Tweet
    ping: String!
    allUsers: [User]!
    allMovies: [Movie!]!
    movie(id: String!): Movie
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }


`

let tweets = [
  { id: "1", text: "first one", userId: "1" },
  { id: "2", text: "second one", userId: "2" }
];

let users = [
  {
    id: "1", firstName: "nochi", lastName: 'ai'
  },
  {
    id: "2", firstName: "noah", lastName: 'ai'
  }
]


const resolvers = {
  Query: {
    allTweets() {
      return tweets
    },
    tweet(_, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    ping() {
      return "pong"
    },
    allUsers() {
      return users;
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then(r => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then(r => r.json())
        .then((json) => json.data.movie);
    }
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      }
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find(tweet => tweet.id === id)
      if (!tweet) return false;
      tweets = tweets.filter(tweet => tweet.id !== id)
      return true
    }
  },
  User: {
    fullName(user) {
      return `${user.firstName} ${user.lastName}`
    }
  },
  Tweet: {
    author({ userId }) {
      return users.find(user => user.id === userId)
    }
  }
}


const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

