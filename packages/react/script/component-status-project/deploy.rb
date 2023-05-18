#!/usr/bin/env ruby
# Adapted from https://github.com/primer/view_components/blob/main/script/update-statuses-project.rb
# Usage: script/update-statuses-project
# frozen_string_literal: true

require "graphql/client"
require "graphql/client/http"

statuses = File.read(File.join(File.dirname(__FILE__), "../../dist/component-status.json"))
statuses_json = JSON.parse(statuses)

class QueryExecutionError < StandardError; end
NOTE_SEPARATOR = " --- "

module Github
  GITHUB_ACCESS_TOKEN = ENV.fetch("GITHUB_TOKEN")
  URL = "https://api.github.com/graphql"
  HttpAdapter = GraphQL::Client::HTTP.new(URL) do
    def headers(_)
      {
        "Authorization" => "Bearer #{GITHUB_ACCESS_TOKEN}",
        "User-Agent" => "Ruby"
      }
    end
  end
  Schema = GraphQL::Client.load_schema(HttpAdapter)
  Client = GraphQL::Client.new(schema: Schema, execute: HttpAdapter)
end

# Project is a GraphQL wrapper for interacting with GitHub projects
class Project
  ProjectQuery = Github::Client.parse <<-'GRAPHQL'
    query {
      repository(owner: "primer", name: "react") {
        project(number: 5) {
          columns(first: 100) {
            nodes {
              name
              id
              databaseId
              cards {
                nodes {
                  id
                  databaseId
                  note
                  column {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  GRAPHQL

  CreateCard = Github::Client.parse <<-'GRAPHQL'
    mutation($note: String!, $projectColumnId: ID!) {
      addProjectCard(input:{note: $note, projectColumnId: $projectColumnId, clientMutationId: "prc-actions"}) {
        __typename
      }
    }
  GRAPHQL

  MoveCard = Github::Client.parse <<-'GRAPHQL'
    mutation($cardId: ID!, $columnId: ID!) {
      moveProjectCard(input:{cardId: $cardId, columnId: $columnId, clientMutationId: "prc-actions"}) {
        __typename
      }
    }
  GRAPHQL

  def self.create_card(note:, column_id:)
    response = Github::Client.query(CreateCard, variables: { note: note, projectColumnId: column_id })
    return unless response.errors.any?

    raise QueryExecutionError, response.errors[:data].join(", ")
  end

  def self.move_card(card_id:, column_id:)
    response = Github::Client.query(MoveCard, variables: { cardId: card_id, columnId: column_id })
    return unless response.errors.any?

    raise(QueryExecutionError, response.errors[:data].join(", "))
  end

  def self.fetch_columns
    response = Github::Client.query(ProjectQuery)
    return response.data.repository.project.columns unless response.errors.any?

    raise(QueryExecutionError, response.errors[:data].join(", "))
  end
end

columns = Project.fetch_columns.nodes

@column_mapping = {}
columns.each do |column|
  @column_mapping[column.name.downcase] = column.id
end

@cards = columns.map(&:cards).map(&:nodes).flatten

def get_card(name_prefix:)
  @cards.find { |card| card.note.start_with?(name_prefix) }
end

def on_correct_column?(card_id:, status:)
  card = @cards.find { |c| c.id == card_id }
  card.column.name.casecmp(status).zero?
end

def move_card(card_id:, status:)
  column_id = @column_mapping[status.downcase]

  puts "move card with #{card_id} to #{status} on column #{column_id}"

  Project.move_card(card_id: card_id, column_id: column_id)
end

def create_card(component_name:, status:)
  column_id = @column_mapping[status.downcase]

  puts "create card with #{component_name} on #{status} on column #{column_id}"

  Project.create_card(note: component_name, column_id: column_id)
end

statuses_json.each do |component_name, component_status|
  card = get_card(name_prefix: component_name)

  if card
    if on_correct_column?(card_id: card.id, status: component_status)
      puts "#{card.id} is on the right column. noop"
    else
      move_card(card_id: card.id, status: component_status)
    end
  else
    create_card(component_name: component_name, status: component_status)
  end
end
