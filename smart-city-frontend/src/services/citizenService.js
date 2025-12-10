import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: '/graphql',
  fetchOptions: {
    mode: 'cors',
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export const GET_ALL_EVENTS = gql`
  query GetAllEvents {
    getAllEvents {
      id
      title
      description
      date
      location
      category
    }
  }
`;

export const GET_ALL_ISSUES = gql`
  query GetAllIssues {
    getAllIssues {
      id
      title
      description
      status
      reportedBy
      dateReported
    }
  }
`;

export const REPORT_ISSUE = gql`
  mutation ReportIssue($title: String!, $description: String!, $reportedBy: String!) {
    reportIssue(title: $title, description: $description, reportedBy: $reportedBy) {
      id
      title
      status
    }
  }
`;

export default client;
