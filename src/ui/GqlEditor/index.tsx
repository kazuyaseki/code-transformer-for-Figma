import { Button } from '@create-figma-plugin/ui';
import GraphiQLExplorer from 'graphiql-explorer';
import { buildSchema, GraphQLSchema } from 'graphql';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-graphql';
import Editor from 'react-simple-code-editor';
import { UiToPluginMessage } from '../../messaging';
import { SavedGqlQuery } from '../../types';
import { convertQueryToFragment } from './convertQueryToFragment';
import { EditorSvgs } from './EditorSvgs';
import { mergeQueryAndFragments } from './mergeQueryAndFragments';
import styles from './styles.css';

// FIXME: add feature to load schema with IntrospectionQuery
const sdlSchema = `type Tweet {
      id: ID!
      # The tweet text. No more than 140 characters!
      body: String
      # When the tweet was published
      date: Date
      # Who published the tweet
      Author: User
      # Views, retweets, likes, etc
      Stats: Stat
    }
    type User {
      id: ID!
      username: String
      first_name: String
      last_name: String
      full_name: String
      name: String @deprecated
      avatar_url: Url
    }
    type Stat {
      views: Int
      likes: Int
      retweets: Int
      responses: Int
    }
    type Notification {
      id: ID
      date: Date
      type: String
    }
    type Meta {
      count: Int
    }
    scalar Url
    scalar Date
    type Query {
      Tweet(id: ID!): Tweet
      Tweets(limit: Int, skip: Int, sort_field: String, sort_order: String): [Tweet]
      TweetsMeta: Meta
      User(id: ID!): User
      Notifications(limit: Int): [Notification]
      NotificationsMeta: Meta
    }
    type Mutation {
      createTweet(body: String): Tweet
      deleteTweet(id: ID!): Tweet
      markTweetRead(id: ID!): Boolean
    }
    `;

const graphqlSchemaObj = buildSchema(sdlSchema);

type Props = {
  nodeId: string;
  query: SavedGqlQuery | null;
  childFragmentStrings: string[];
  setQuery: (query: SavedGqlQuery) => void;
};

export const GqlEditor = ({
  query,
  setQuery,
  nodeId,
  childFragmentStrings,
}: Props) => {
  const [schema, setSchema] = useState<GraphQLSchema | null>(graphqlSchemaObj);

  const textForViewer = useMemo(() => {
    if (query && query.editingMode === 'fragment') {
      return convertQueryToFragment(query.originalQuery);
    }
    if (query?.originalQuery) {
      return mergeQueryAndFragments(query.originalQuery, childFragmentStrings);
    }
    return '';
  }, [query, childFragmentStrings]);

  const onSaveQuery = () => {
    const msg: UiToPluginMessage = {
      type: 'save-gql-query',
      nodeId: nodeId,
      originalQuery: query?.originalQuery || '',
      editingMode: query?.editingMode || 'query',
      textForViewer,
    };
    parent.postMessage({ pluginMessage: msg }, '*');
  };

  const setEditingMode = (editingMode: 'query' | 'fragment') => {
    setQuery({
      originalQuery: query?.originalQuery || '',
      editingMode,
    });
  };

  return (
    <body class={styles.body}>
      <div class={styles['editing-mode']}>
        <span>Edit as</span>

        <div class={styles['query-buttons']}>
          <button
            class={
              !query || query?.editingMode === 'query'
                ? styles['query-selected']
                : ''
            }
            onClick={() => {
              setEditingMode('query');
            }}
          >
            Query
          </button>
          <button
            class={
              query?.editingMode === 'fragment' ? styles['query-selected'] : ''
            }
            onClick={() => {
              setEditingMode('fragment');
            }}
          >
            Fragment
          </button>
        </div>
      </div>

      <div class={styles.container}>
        <GraphiQLExplorer
          query={query?.originalQuery || ''}
          showAttribution
          schema={schema}
          onRunOperation={(e) => {
            console.log(e);
          }}
          explorerIsOpen
          onEdit={(newQuery: string) => {
            setQuery({
              originalQuery: newQuery,
              editingMode: query?.editingMode || 'query',
            });
          }}
          arrowOpen={<EditorSvgs.arrowOpen />}
          arrowClosed={<EditorSvgs.arrowClosed />}
          checkboxUnchecked={<EditorSvgs.checkboxUnchecked />}
          checkboxChecked={<EditorSvgs.checkboxChecked />}
          styles={{
            buttonStyle: {
              backgroundColor: 'transparent',
              border: 'none',
              color: 'hsla(var(--color-neutral), var(--alpha-secondary, 0.6))',
              cursor: 'pointer',
              fontSize: '1em',
              textAlign: 'left',
            },
            explorerActionsStyle: {
              padding: 'var(--px-8) var(--px-4)',
              textAlign: 'left',
            },
            actionButtonStyle: {
              backgroundColor: 'transparent',
              border: 'none',
              color: 'hsla(var(--color-neutral), var(--alpha-secondary, 0.6))',
              cursor: 'pointer',
              fontSize: '1em',
              textAlign: 'left',
            },
          }}
        />

        <div class={styles['query-editor-container']}>
          <Editor
            highlight={function (text: string) {
              return highlight(text, languages.graphql, 'graphql');
            }}
            onValueChange={() => {}}
            preClassName={styles.editor}
            textareaClassName={styles.editor}
            value={textForViewer}
            className={styles['query-editor']}
          />
          <Button onClick={onSaveQuery}>Save Query</Button>
        </div>
      </div>
    </body>
  );
};
