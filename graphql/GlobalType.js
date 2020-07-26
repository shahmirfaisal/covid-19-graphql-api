const { GraphQLString, GraphQLObjectType } = require("graphql");

const GlobalType = new GraphQLObjectType({
  name: "Global",
  description: "It gives the overall covid-19 information of the world.",
  fields: () => ({
    totalCases: { type: GraphQLString },
    totalDeaths: { type: GraphQLString },
    totalRecovered: { type: GraphQLString },
    activeCases: { type: GraphQLString },
    closedCases: { type: GraphQLString },
  }),
});

module.exports = GlobalType;
