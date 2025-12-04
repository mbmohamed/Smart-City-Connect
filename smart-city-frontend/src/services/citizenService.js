import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8084/graphql',
    cache: new InMemoryCache(),
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
